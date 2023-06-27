import { gotScraping } from "got-scraping";

export const api = gotScraping.extend({
  prefixUrl: "https://apptoogoodtogo.com/api/",
  headers: {
    "User-Agent":
      "TooGoodToGo/21.9.0 (813) (iPhone/iPhone 7 (GSM); iOS 15.1; Scale/2.00)",
    "Content-Type": "application/json; charset=utf-8",
    Accept: "application/json",
    "Accept-Language": "en-US",
    "Accept-Encoding": "gzip",
  },
  responseType: "json",
  resolveBodyOnly: true,
  retry: {
    limit: 2,
    methods: ["GET", "POST", "PUT", "HEAD", "DELETE", "OPTIONS", "TRACE"],
    statusCodes: [401, 403, 408, 413, 429, 500, 502, 503, 504, 521, 522, 524],
  },
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
