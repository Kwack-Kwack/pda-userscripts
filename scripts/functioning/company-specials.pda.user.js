// ==UserScript==
// @name         company-specials
// @namespace    https://github.com/Kwack-Kwack/pda-userscripts
// @version      0.0.1
// @description  Show relevant specials on the companies page
// @author       Kwack [2190604]
// @match        https://www.torn.com/joblist.php*
// @grant        none
// ==/UserScript==
// ** THIS SCRIPT CONTAINS A HACKY FIX TO PDA FAILING TO INSERT PDA_httpGet DEFINITIONS, I DO NOT RECOMMEND INSTALLING YET **
/**
 * @description This is the version number of the data.
 * **DO NOT MANUALLY EDIT THIS**, it exists to allow me to change the data format without breaking the script for everyone.
 * I'll release a new script with a new version if needed.
 */
const companySpecialsDataVer = "v1";
/**
 * @description This is the url that the script pulls the data from. It will pull new data every week, in case job specials change.
 * Contact me on discord `@duckyblair` if the data needs updating, or if you want to help maintain it.
 * Default: `https://raw.githubusercontent.com/Kwack-Kwack/pda-userscripts/main/data/company-specials-[ver].json`
 */
const companySpecialsDataURL = `https://raw.githubusercontent.com/Kwack-Kwack/pda-userscripts/main/data/company-specials-${companySpecialsDataVer}.json`;
// declare const PDA_httpGet: (url: string) => Promise<{
// 	responseHeaders: string;
// 	responseText: string;
// 	status: string;
// 	statusText: string;
// }>;
/**
 * @description This is a hacky fix to PDA failing to insert PDA_httpGet definitions. This will be removed once the injection is working correctly
 *
 */
const PDA_httpGet = async (url) => {
    // @ts-expect-error
    return flutter.inapp_webview.callHandler("PDA_httpGet", url);
};
const getCompanySpecialsData = async (force) => {
    const local = JSON.parse(localStorage.getItem("kw--company-specials-data"));
    if (force || !local || typeof local.updateAt !== "number" || local.updateAt < Date.now()) {
        return await PDA_httpGet(companySpecialsDataURL)
            .then((res) => JSON.parse(res.responseText))
            .then((res) => {
            const data = { data: res, updateAt: Date.now() + 1000 * 60 * 60 * 24 * 7 };
            localStorage.setItem("kw--company-specials-data", JSON.stringify(data));
            console.log(force ? "Company Specials Data Force-Updated" : "Company Specials Data Updated");
            return data;
        });
    }
    else
        return local;
};
const waitForElements = async () => new Promise((resolve, reject) => {
    let count = 0;
    const interval = setInterval(() => {
        count++;
        if (document.querySelector("div.company-details > div.title-black") &&
            document.querySelector("div.company-details-wrap")) {
            clearInterval(interval);
            resolve();
        }
        else if (count > 200) {
            clearInterval(interval);
            reject("Waiting for elements timed out, there's a chance Torn changed their selectors. Contact me (Kwack [2190604]) if this is unexpected.");
        }
    }, 100);
});
(() => {
    const s = document.createElement("style");
    s.innerHTML = `
	#kw--company-specials-container {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}

	#kw--company-specials-container > div {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 8px;
		max-width: 15%;
		text-align: center;
	}

	#kw--company-specials-container > div > p {
		padding: 2px;
		margin: 2px;
		border-bottom: 1px solid grey;
	}

	#kw--company-specials-container > div > :first-child {
		font-weight: bold;
		font-size: 1.1em;
	}

	#kw--company-specials-container > div > :last-child {
		border-bottom: none;
	}
	`;
    document.head.appendChild(s);
})();
Promise.all([getCompanySpecialsData(), waitForElements()])
    .then(([companySpecialsData]) => {
    const companyType = document
        .querySelector("div.company-details > div.title-black")
        ?.lastElementChild.textContent.substring(2);
    const companySpecials = companySpecialsData.data[companyType];
    // Create the specials content
    const specialsContainer = document.createElement("div");
    specialsContainer.id = "kw--company-specials-container";
    for (const [stars, special] of Object.entries(companySpecials)) {
        const specialContainer = document.createElement("div");
        specialContainer.id = `kw--company-specials-${stars}`;
        specialContainer.append(...[
            `${special.name} (${stars}★)`,
            special.cost === "Passive" ? "Passive" : `${special.cost} Point${special.cost === "1" ? "" : "s"}`,
            special.effect,
        ].map((text) => {
            const e = document.createElement("p");
            e.textContent = text;
            return e;
        }));
        specialsContainer.append(specialContainer);
    }
    document.querySelector("div.company-details-wrap").insertAdjacentElement("afterend", specialsContainer);
})
    .catch((e) => {
    console.error(e);
    const error = document.createElement("div");
    error.textContent = "Company Specials Error:" + typeof e === "string" ? e : JSON.stringify(e);
    error.style.color = "red";
    document.querySelector("div.company-details-wrap").insertAdjacentElement("afterend", error);
});
