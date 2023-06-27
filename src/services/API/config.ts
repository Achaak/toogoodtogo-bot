import { gotScraping } from "got-scraping";

export const api = gotScraping.extend({
  prefixUrl: "https://apptoogoodtogo.com/api/",
  headers: {
    "User-Agent":
      "TGTG/22.5.5 Dalvik/2.1.0 (Linux; Android 12; SM-G920V Build/MMB29K)",
    "Content-Type": "application/json; charset=utf-8",
    Accept: "application/json",
    "Accept-Language": "en-US",
    "Accept-Encoding": "gzip",
  },
  responseType: "json",
  resolveBodyOnly: true,
  // @ts-ignore
  headerGeneratorOptions: {
    browsers: [
      {
        name: "chrome",
      },
    ],
    devices: ["mobile"],
    locales: ["en-US"],
    operatingSystems: ["ios"],
  },
});
