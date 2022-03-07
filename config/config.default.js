export default {
  api: {
    credentials: {
      email: "YOUR EMAIL",
    },
    headers: {
      "User-Agent":
        "TooGoodToGo/21.9.0 (813) (iPhone/iPhone 7 (GSM); iOS 15.1; Scale/2.00)",
    },
    pollingIntervalInMs: 30000,
    authenticationIntervalInMS: 3600000,
  },
  notifications: {
    console: {
      enabled: false,
    },
    desktop: {
      enabled: false,
    },
    telegram: {
      enabled: false,
      bot_token: "BOT TOKEN",
    },
  },
};
