import {
  authByEmail as APIAuthByEmail,
  authByRequestPollingId as APIAuthByRequestPollingId,
  getFavorite,
  refresh,
} from "./../../services/API/index.js";
import isEqual from "lodash.isequal";
import { EventEmitter } from "events";
import { getData, setData } from "./../../store/datastore.js";
import { Favorite } from "./../../types/favorite.js";
import { env } from "./../../env/server.js";

type DataManagerType = {
  eventEmitter: EventEmitter;
};

class DataManager {
  eventEmitter: EventEmitter;

  firstLoad: boolean;

  access_token: string | null;
  refresh_token: string | null;
  cookie: string | string[] | null;
  userId: number | null;

  lastRender: number | undefined;
  loopFlag: boolean;

  favorite: Favorite[];
  favoriteAvailable: string[];
  favoriteEmpty: string[];

  timestamp_get_favorite: number;
  timestamp_refresh_token: number;

  interval: NodeJS.Timeout | null;

  constructor({ eventEmitter }: DataManagerType) {
    this.eventEmitter = eventEmitter;

    this.firstLoad = true;

    this.access_token = null;
    this.refresh_token = null;
    this.cookie = null;
    this.userId = null;

    this.lastRender = undefined;
    this.loopFlag = false;

    this.favorite = [];
    this.favoriteAvailable = [];
    this.favoriteEmpty = [];

    this.timestamp_get_favorite = 0;
    this.timestamp_refresh_token = 0;

    this.interval = null;

    this.init();
  }

  async init() {
    await this.getStore();

    if (!this.access_token || !this.refresh_token || !this.userId) {
      this.authByEmail();
    }

    this.startLoop();
  }

  async getStore() {
    this.access_token = await getData("access_token");
    this.refresh_token = await getData("refresh_token");
    this.userId = await getData("userId");
  }

  async setAuth({
    access_token,
    refresh_token,
    userId,
    cookie,
  }: {
    access_token?: string;
    refresh_token?: string;
    userId?: number;
    cookie?: string | string[];
  }) {
    if (access_token) {
      this.access_token = access_token;
      await setData("access_token", access_token);
    }
    if (refresh_token) {
      this.refresh_token = refresh_token;
      await setData("refresh_token", refresh_token);
    }
    if (userId) {
      this.userId = userId;
      await setData("userId", userId);
    }
    if (cookie) {
      this.cookie = cookie;
      await setData("cookie", cookie);
    }
  }

  // Auth by email (send polling id by email)
  authByEmail() {
    APIAuthByEmail()
      .then((res) => {
        // Get data
        const data = res.body;

        if (res.statusCode === 200) {
          console.log("Click on the link in your email.");

          this.interval = setInterval(() => {
            this.authByRequestPollingId(data.polling_id);
          }, 10000);
        } else {
          console.log("Error authByEmail");
          console.log(data);
        }
      })
      .catch((e) => {
        console.log("Error authByEmail");
        console.log(e);
      });
  }

  // Send polling id to API
  authByRequestPollingId(polling_id: string) {
    APIAuthByRequestPollingId({
      polling_id: polling_id,
    })
      .then((res) => {
        // Get data
        const data = res.body;
        if (res.statusCode === 200) {
          this.interval && clearInterval(this.interval);

          this.setAuth({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            userId: data.startup_data.user.user_id,
            cookie: res.headers["Set-Cookie"],
          });
          console.log("You are connected.");

          // Start the loop
          this.startLoop();
        } else if (res.statusCode === 202) {
          console.log("Click on the link in your email.");
        } else {
          console.log("Error authByRequestPollingId");
        }
      })
      .catch((e) => {
        console.log("Error authByRequestPollingId");
        console.log(e);
      });
  }

  // Update function of the loop
  update() {
    // Defined functeventn
    var timestamp = new Date().getTime();

    if (
      timestamp - this.timestamp_get_favorite >
      parseInt(env.POLLING_INTERVAL_IN_MS)
    ) {
      this.getFavorite();
      this.timestamp_get_favorite = timestamp;
    }

    if (
      timestamp - this.timestamp_refresh_token >
      parseInt(env.AUTHENTICATION_INTERVAL_IN_MS)
    ) {
      this.refreshToken();
      this.timestamp_refresh_token = timestamp;
    }
  }

  getFavorite() {
    if (!this.access_token) return;
    if (!this.userId) return;

    getFavorite({
      userId: this.userId,
      accessToken: this.access_token,
    })
      .then((res) => {
        // Get data
        const data = res.body;

        if (res.statusCode === 200) {
          this.favorite = data.items;

          // Format all favorite
          this.formatFavorite();
        }
      })
      .catch((e) => {
        console.log("Error getFavorite");
        console.log(e);
      });
  }

  refreshToken() {
    if (!this.refresh_token) return;

    refresh({ refreshToken: this.refresh_token }).then((res) => {
      // Get data
      const data = res.body;
      if (res.statusCode === 200) {
        this.setAuth({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          cookie: res.headers["Set-Cookie"],
        });
      }
    });
  }

  formatFavorite() {
    // Get favorite available
    const favoriteAvailable = [...this.favorite]
      .filter((item) => {
        return item.items_available !== 0;
      })
      .map((item) => item.store.store_id);

    // Get favorite for message
    const favoriteNotification = [...this.favorite]
      .filter((fn) => {
        if (
          (fn.items_available === 0 &&
            this.favoriteEmpty.some((fe) => fe === fn.store.store_id)) ||
          (fn.items_available === 0 && this.firstLoad)
        ) {
          return false;
        } else {
          return true;
        }
      })
      .map((item) => item.store.store_id);

    // Get new favorite empty
    const _favoriteEmpty = [...this.favorite]
      .filter((item) => {
        return item.items_available === 0;
      })
      .map((item) => item.store.store_id);

    // If favorite available change
    if (!isEqual(favoriteAvailable, this.favoriteAvailable)) {
      this.favoriteAvailable = favoriteAvailable;

      // Format message
      let messageFormated = favoriteNotification.map((item) => {
        const store = this.favorite.find((fn) => fn.store.store_id === item);

        if (store) {
          return `${store.store.store_name}: ${store.items_available}`;
        }
      });

      this.eventEmitter.emit(
        "favorite-notification",
        messageFormated.join("\n")
      );
    }

    // Set favorite empty
    this.favoriteEmpty = _favoriteEmpty;

    this.firstLoad = false;
  }

  // Loop functeventn
  loop(timestamp = new Date().getTime()) {
    this.update();

    this.lastRender = timestamp;

    setTimeout(() => {
      if (this.loopFlag) this.loop();
    }, 100);
  }

  // Start the loop
  startLoop() {
    this.loopFlag = true;
    this.loop();
  }

  // Stop the loop
  stopLoop() {
    this.loopFlag = false;
  }
}

export default DataManager;
