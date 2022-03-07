import { gotScraping } from "got-scraping";
import Config from "./../../../config/config.js";

export const api = gotScraping.extend({
  prefixUrl: "https://apptoogoodtogo.com/api/",
  headers: {
    "User-Agent": Config.api.headers["User-Agent"],
    "Content-Type": "application/json",
    Accept: "",
    "Accept-Language": "en-US",
  },
  responseType: "json",
  // @ts-ignore
  headerGeneratorOptions: {
    browsers: [
      {
        name: "safari",
      },
    ],
    devices: ["mobile"],
    locales: ["en-US"],
    operatingSystems: ["ios"],
  },
});
