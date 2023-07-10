import { gotScraping } from "got-scraping";
import { CookieJar } from "tough-cookie"

export const BASE_URL = 'https://apptoogoodtogo.com/api/';
export const API_ITEM_ENDPOINT = 'item/v8/';
export const AUTH_BY_EMAIL_ENDPOINT = 'auth/v3/authByEmail';
export const AUTH_POLLING_ENDPOINT = 'auth/v3/authByRequestPollingId';
export const REFRESH_ENDPOINT = 'auth/v3/token/refresh';
export const USER_AGENT = "TooGoodToGo/21.9.0 (813) (iPhone/iPhone 7 (GSM); iOS 15.1; Scale/2.00)";
export const DEVICE_TYPE = "IOS";

const cookieJar = new CookieJar();

export const api = gotScraping.extend({
  cookieJar,
  prefixUrl: BASE_URL,
  headers: {
    "User-Agent": USER_AGENT,
    "Content-Type": "application/json; charset=utf-8",
    Accept: "application/json",
    "Accept-Language": "en-US",
    "Accept-Encoding": "gzip",
  },
  responseType: "json",
  retry: {
    limit: 2,
    methods: ["GET", "POST", "PUT", "HEAD", "DELETE", "OPTIONS", "TRACE"],
    statusCodes: [401, 403, 408, 413, 429, 500, 502, 503, 504, 521, 522, 524],
  },
  // @ts-ignore
  headerGeneratorOptions: {
    browsers: [
      { name: "safari" },
    ],
    devices: ["mobile"],
    locales: ["en-US"],
    operatingSystems: ["ios"],
  },
});
