// ==UserScript==
// @name         City Shops Max-Buy: PDA
// @namespace    https://github.com/Kwack-Kwack/pda-userscripts
// @version      1.0.1
// @description  A PDA-Userscript to add a max-buy button on city shops
// @author       Kwack [2190604]
// @match        https://www.torn.com/shops.php*
// @match		 https://www.torn.com/bigalgunshop.php*
// @grant        none
// ==/UserScript==

// Note: Appropriated from the TT script, available at
// https://github.com/Mephiles/torntools_extension/blob/master/extension/scripts/features/shops-fill-max/ttShopsFillMax.js
let items = document.querySelectorAll(".item-desc");

[...items].forEach((item) => {
	const fillMaxButton = document.createElement("button");
	fillMaxButton.innerText = "Fill MAX";
	fillMaxButton.id = "kw-fillmaxbutton";
	fillMaxButton.addEventListener("click", fillMax);

	const buyButton = item.querySelector(".buy-act > button");
	buyButton.appendChild(document.createElement("br"));
	buyButton.appendChild(fillMaxButton);

	function fillMax(e) {
		e.stopPropagation();

		const stock = parseInt(item.querySelector("span.instock").innerText.replace(",", ""));
		const price = parseInt(item.querySelector("span.price").innerText.replace(/[$,]/g, ""));
		const moneyOnHand = (() => {
			const str = document.querySelector("#user-money").innerText.replace(/[$,]/g, "");
			switch (str.slice(-1)) {
				case "k":
					return parseFloat(str.slice(0, -1)) * 1000;
				case "m":
					return parseFloat(str.slice(0, -1)) * 1000000;
				case "b":
					return parseFloat(str.slice(0, -1)) * 1000000000;
				default:
					return parseFloat(str);
			}
		})();
		const max = [Math.floor(moneyOnHand / price), stock, 100].sort((a, b) => a - b)[0];
		item.querySelector("input").value = max;
	}
});

const css = `
button#kw-fillmaxbutton {
	font-size: 10px;
	padding: 0;
	border: none;
	color: deeppink;
	transform: translate(-10px)
}
`;

const style = document.createElement("style");
style.innerHTML = css;
document.head.appendChild(style);
