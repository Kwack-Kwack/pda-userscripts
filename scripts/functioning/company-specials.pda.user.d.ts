/**
 * @description This is the version number of the data.
 * **DO NOT MANUALLY EDIT THIS**, it exists to allow me to change the data format without breaking the script for everyone.
 * I'll release a new script with a new version if needed.
 */
declare const companySpecialsDataVer = "v1";
/**
 * @description This is the url that the script pulls the data from. It will pull new data every week, in case job specials change.
 * Contact me on discord `@duckyblair` if the data needs updating, or if you want to help maintain it.
 * Default: `https://raw.githubusercontent.com/Kwack-Kwack/pda-userscripts/main/data/company-specials-[ver].json`
 */
declare const companySpecialsDataURL: string;
type CompanySpecialsData = {
	[key: string]: {
		[key in "1" | "3" | "5" | "7" | "10"]: {
			name: string;
			cost: `${number}` | "Passive";
			effect: string;
		};
	};
};
/**
 * @description This is a hacky fix to PDA failing to insert PDA_httpGet definitions. This will be removed once the injection is working correctly
 *
 */
declare const PDA_httpGet: (url: string) => Promise<{
	responseHeaders: string;
	responseText: string;
	status: number;
	statusText: string;
}>;
declare const getCompanySpecialsData: (force?: boolean) => Promise<{
	data: CompanySpecialsData;
	updateAt: number;
}>;
declare const waitForElements: () => Promise<void | Error>;
