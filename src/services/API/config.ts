import got from "got";
import Config from "./../../../config/config.js";

export const api = got.extend({
  prefixUrl: "https://apptoogoodtogo.com/api/",
  headers: {
    "User-Agent": Config.api.headers["User-Agent"],
    "Content-Type": "application/json",
    Accept: "application/json",
    "Accept-Language": "en-US",
  },
  responseType: "json",
});
