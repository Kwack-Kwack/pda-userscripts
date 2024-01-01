// ==UserScript==
// @name         auto-stock-fill
// @namespace    https://github.com/Kwack-Kwack/pda-userscripts
// @version      0.0.4
// @description  Automatically fill your company's stock
// @author       Kwack [2190604]
// @match        https://www.torn.com/*
// @grant        none
// ==/UserScript==
(async () => {
	try {
		// if (getHashParams().get("option") !== "stock")
		// 	window.addEventListener("hashchange", () => {
		// 		if (getHashParams().get("option") === "stock") start();
		// 	});
		// else start();
		window.addEventListener("hashchange", (e) => {
			if (getHashParams(new URL(e.newURL).hash).get("option") === "stock") start();
		});
		if (getHashParams(document.location.hash).get("option") === "stock") start();
		async function start() {
			const form = await getForm();
			addButton(form);
		}
		function getHashParams(hash) {
			return new URLSearchParams(hash.replace(/[#\/]/g, ""));
		}
		function callback(form) {
			const storageCap = Array.from(form.querySelectorAll(".storage-capacity > *")).map((el, i) => {
				if (!el.dataset.initial) {
					console.log("No initial value: " + el.outerHTML);
					throw new Error(`**KW** STORAGE CAPACITY NOT FOUND AT INDEX ${i}`);
				}
				const parsed = parseInt(el.dataset.initial);
				if (isNaN(parsed)) {
					console.log("Cannot parse: " + el.dataset.initial);
					throw new Error(`**KW** STORAGE CAPACITY AT INDEX ${i} IS NAN`);
				}
				return parsed;
			});
			if (storageCap.some(isNaN)) throw new Error("**KW** STORAGE CAPACITY IS NAN");
			const usableCap = storageCap[1] - storageCap[0];
			const totalSoldDaily = parseInt(form.querySelector(".stock-list > li.total .sold-daily").textContent);
			if (isNaN(totalSoldDaily)) throw new Error("**KW** TOTAL SOLD DAILY IS NAN");
			Array.from(form.querySelectorAll(".stock-list > li:not(.total):not(.quantity)")).forEach((el) => {
				const soldDaily = parseInt(el.querySelector(".sold-daily").lastChild.textContent);
				const neededStock = Math.max((soldDaily / totalSoldDaily) * usableCap, 0);
				updateInput(el.querySelector("input"), neededStock.toString());
			});
		}
		function addButton(form) {
			if ($("#kw-auto-fill").length > 0) return; // Do not inject button twice
			$("<span/>", { class: "btn-wrap silver" })
				.append(
					$("<span/>", { class: "btn" }).append(
						$("<button/>", { class: "torn-btn" })
							.on("click", () => callback(form))
							.text("Auto-fill"),
					),
				)
				.appendTo(form);
			// const button = document.createElement("button");
			// button.textContent = "Auto-fill";
			// button.className = "torn-btn";
			// // button.style.cssText = "padding: 0.5rem; ";
			// button.addEventListener("click", () => callback(form));
			// form.appendChild(button);
		}
		function getForm() {
			return new Promise((res, rej) => {
				let tick = 0;
				const interval = setInterval(() => {
					const form = document.querySelector("div#stock > form");
					if (form) {
						clearInterval(interval);
						res(form);
					} else {
						tick++;
						if (tick > 100) {
							clearInterval(interval);
							rej(new Error("**KW** FORM NOT FOUND"));
						}
					}
				}, 100);
			});
		}
		function updateInput(input, value) {
			input.value = value;
			input.dispatchEvent(new Event("change", { bubbles: true }));
			input.dispatchEvent(new Event("input", { bubbles: true }));
		}
	} catch (e) {
		console.error(e);
		alert(JSON.stringify(e));
	}
})();

