import {
  authByEmail as APIAuthByEmail,
  authByRequestPollingId as APIAuthByRequestPollingId,
  getFavorite,
  refresh,
} from "./../../services/API/index.js";
import Config from "./../../../config/config.js";
import isEqual from "lodash.isequal";
import { EventEmitter } from "events";
import { getData, setData } from "./../../store/datastore.js";
import { Favorite } from "src/types/favorite.js";

type DataManagerType = {
  eventEmitter: EventEmitter;
};

class DataManager {
  eventEmitter: EventEmitter;

  firstLoad: boolean;

  access_token: string | null;
  refresh_token: string | null;
  userId: number | null;

  lastRender: number | undefined;
  loopFlag: boolean;

  favorite: Favorite[];

  favoriteAvailable: {
    store_id: string;
    store_name: string;
    items_available: number;
  }[];

  favoriteEmpty: {
    store_id: string;
    store_name: string;
    items_available: number;
  }[];

  timestamp_get_favorite: number;
  timestamp_refresh_token: number;

  constructor({ eventEmitter }: DataManagerType) {
    this.eventEmitter = eventEmitter;

    this.firstLoad = true;

    this.access_token = null;
    this.refresh_token = null;
    this.userId = null;

    this.lastRender = undefined;
    this.loopFlag = false;

    this.favorite = [];
    this.favoriteAvailable = [];
    this.favoriteEmpty = [];

    this.timestamp_get_favorite = 0;
    this.timestamp_refresh_token = 0;

    this.init();
  }

  async init() {
    this.getStore();

    if (!this.access_token || !this.refresh_token || !this.userId) {
      this.authByEmail();
    }

    this.startLoop();
  }

  getStore() {
    this.access_token = getData("access_token");
    this.refresh_token = getData("refresh_token");
    this.userId = getData("userId");
  }

  setAuth({
    access_token,
    refresh_token,
    userId,
  }: {
    access_token?: string;
    refresh_token?: string;
    userId?: number;
  }) {
    if (access_token) {
      this.access_token = access_token;
      setData("access_token", access_token);
    }
    if (refresh_token) {
      this.refresh_token = refresh_token;
      setData("refresh_token", refresh_token);
    }
    if (userId) {
      this.userId = userId;
      setData("userId", userId);
    }
  }

  // Auth by email (send polling id by email)
  authByEmail() {
    APIAuthByEmail()
      .then((res) => {
        // Get data
        const data = res.body;

        if (res.statusCode === 200) {
          console.log(
            "Press enter to continue when you have clicked on the link in your email."
          );
          var stdin = process.openStdin();
          stdin.addListener("data", () => {
            this.authByRequestPollingId(data.polling_id);
          });
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
          this.setAuth({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            userId: data.startup_data.user.user_id,
          });
          console.log("You are connected.");

          // Start the loop
          this.startLoop();
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
      Config.api.pollingIntervalInMs
    ) {
      this.getFavorite();
      this.timestamp_get_favorite = timestamp;
    }

    if (
      timestamp - this.timestamp_refresh_token >
      Config.api.authenticationIntervalInMS
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
        });
      }
    });
  }

  formatFavorite() {
    // Get favorite available
    const _favoriteAvailable = [...this.favorite]
      .filter((item) => {
        return item.items_available !== 0;
      })
      .map((item) => {
        return {
          store_id: item.store.store_id,
          store_name: item.store.store_name,
          items_available: item.items_available,
        };
      });

    // Get favorite for message
    const _favoriteNotification = [...this.favorite]
      .filter((item) => {
        if (
          (item.items_available === 0 &&
            this.favoriteEmpty.some(
              (item2) => item.store.store_name === item2.store_name
            )) ||
          (item.items_available === 0 && this.firstLoad)
        ) {
          return false;
        } else {
          return true;
        }
      })
      .map((item) => {
        return {
          store_id: item.store.store_id,
          store_name: item.store.store_name,
          items_available: item.items_available,
        };
      });

    // Get new favorite empty
    const _favoriteEmpty = [...this.favorite]
      .filter((item) => {
        return item.items_available === 0;
      })
      .map((item) => {
        return {
          store_id: item.store.store_id,
          store_name: item.store.store_name,
          items_available: item.items_available,
        };
      });

    // If favorite available change
    if (!isEqual(_favoriteAvailable, this.favoriteAvailable)) {
      this.favoriteAvailable = _favoriteAvailable;

      // Format message
      let messageFormated = _favoriteNotification.map((item) => {
        return `${item.store_name}: ${item.items_available}`;
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
