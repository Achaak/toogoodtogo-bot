import { gotScraping } from "got-scraping";

export const BASE_URL = 'https://apptoogoodtogo.com/api/';
export const API_ITEM_ENDPOINT = 'item/v8/';
export const AUTH_BY_EMAIL_ENDPOINT = 'auth/v3/authByEmail';
export const AUTH_POLLING_ENDPOINT = 'auth/v3/authByRequestPollingId';
export const REFRESH_ENDPOINT = 'auth/v3/token/refresh';
export const USER_AGENT = "TGTG/22.5.5 Dalvik/2.1.0 (Linux; Android 12; SM-G920V Build/MMB29K)";
export const DEVICE_TYPE = "ANDROID";

export const api = gotScraping.extend({
  prefixUrl: BASE_URL,
  headers: {
    "User-Agent": USER_AGENT,
    "Content-Type": "application/json; charset=utf-8",
    Accept: "application/json",
    "Accept-Language": "en-UK",
    "Accept-Encoding": "gzip",
  },
  responseType: "json",
  // @ts-ignore
  headerGeneratorOptions: {
    browsers: [
      {
        name: "chrome",
      },
    ],
    devices: ["mobile"],
    locales: ["en-US"],
    operatingSystems: ["android"],
  },
});
