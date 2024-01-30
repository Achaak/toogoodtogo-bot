import http from 'http';
import { getData, setData } from './store.js';
import type { ItemFavorite } from './types/favorite.js';
import { env } from './env/server.js';
import { apiClient } from './api.js';
import { Telegram } from './notification/telegram.js';
import { Desktop } from './notification/desktop.js';
import { Console } from './notification/console.js';
import { type Notification } from './types/notification.js';
import { Discord } from './notification/discord.js';

const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export class Core {
  private access_token: string | null;
  private refresh_token: string | null;
  private userId: string | null;

  private loopIsRunning: boolean;

  private favorite: ItemFavorite[];

  private timestamp_get_favorite: number;
  private timestamp_refresh_token: number;

  private pollingInterval: NodeJS.Timeout | null;

  private authenticationIntervalInMs =
    parseInt(env.AUTHENTICATION_INTERVAL_IN_MS) * random(50, 150) * 0.01;
  private getItemsIntervalInMs =
    parseInt(env.GET_ITEMS_INTERVAL_IN_MS) * random(50, 150) * 0.01;

  private telegram: Telegram | null;
  private console: Console | null;
  private desktop: Desktop | null;
  private discord: Discord | null;

  constructor() {
    this.access_token = null;
    this.refresh_token = null;
    this.userId = null;

    this.loopIsRunning = false;

    this.favorite = [];

    this.timestamp_get_favorite = 0;
    this.timestamp_refresh_token = 0;

    this.pollingInterval = null;

    if (env.NOTIFICATIONS_TELEGRAM_ENABLED === 'true') {
      this.telegram = new Telegram();
    } else {
      this.telegram = null;
    }

    if (env.NOTIFICATIONS_CONSOLE_ENABLED === 'true') {
      this.console = new Console();
    } else {
      this.console = null;
    }

    if (env.NOTIFICATIONS_DESKTOP_ENABLED === 'true') {
      this.desktop = new Desktop();
    } else {
      this.desktop = null;
    }

    if (env.NOTIFICATIONS_DISCORD_ENABLED === 'true') {
      this.discord = new Discord();
    } else {
      this.discord = null;
    }

    void this.init();
  }

  private async init() {
    await this.getStore();

    if (!this.access_token || !this.refresh_token || !this.userId) {
      await this.loginByEmail();
    }

    this.startLoop();
  }

  async getStore() {
    this.access_token = (await getData<string>('access_token')) ?? null;
    this.refresh_token = (await getData<string>('refresh_token')) ?? null;
    this.userId = (await getData<string>('userId')) ?? null;
  }

  private async setAuth({
    access_token,
    refresh_token,
    userId,
  }: {
    access_token?: string;
    refresh_token?: string;
    userId?: string;
  }) {
    if (access_token) {
      this.access_token = access_token;
      await setData('access_token', access_token);
    }
    if (refresh_token) {
      this.refresh_token = refresh_token;
      await setData('refresh_token', refresh_token);
    }
    if (userId) {
      this.userId = userId;
      await setData('userId', userId);
    }
  }

  private async loginByEmail() {
    const { polling_id } = await apiClient.loginByEmail();

    console.log('Click on the link in your email.');
    console.log("Don't use you mobile phone if Too Good To Go is installed.");

    this.pollingInterval = setInterval(() => {
      void this.authPolling(polling_id);
    }, 10000);
  }

  private async authPolling(polling_id: string) {
    const res = await apiClient.authPolling({
      pollingId: polling_id,
    });

    if (res === null) {
      return;
    }

    const { access_token, refresh_token, startup_data } = res;
    this.pollingInterval && clearInterval(this.pollingInterval);
    await this.setAuth({
      access_token: access_token,
      refresh_token: refresh_token,
      userId: startup_data.user.user_id,
    });
    console.log('You are connected.');

    this.startLoop();
  }

  private async getFavorite() {
    if (!this.access_token) return;
    if (!this.userId) return;

    const { items } = await apiClient.getItems({
      userId: this.userId,
      accessToken: this.access_token,
    });

    const newFavoriteEmpty = [...items].filter((item) => {
      const store = this.favorite.find(
        (fn) => fn.store.store_id === item.store.store_id
      );

      if (item.items_available === 0 && store && store.items_available !== 0) {
        return true;
      }

      return false;
    });

    const newFavoriteAvailable = [...items].filter((item) => {
      const store = this.favorite.find(
        (fn) => fn.store.store_id === item.store.store_id
      );

      if (
        (item.items_available !== 0 && !store) ||
        (item.items_available !== 0 && store && store.items_available === 0)
      ) {
        return true;
      }

      return false;
    });

    const favoriteUpdated = [...items].filter((item) => {
      const store = this.favorite.find(
        (fn) => fn.store.store_id === item.store.store_id
      );

      if (
        store &&
        store.items_available !== item.items_available &&
        item.items_available !== 0
      ) {
        return true;
      }

      return false;
    });

    if (
      newFavoriteEmpty.length > 0 ||
      newFavoriteAvailable.length > 0 ||
      favoriteUpdated.length > 0 ||
      this.favorite.length !== items.length
    ) {
      this.sendNotification({
        type: 'allFavorite',
        data: items,
      });
    }

    if (newFavoriteAvailable.length > 0) {
      this.sendNotification({
        type: 'newFavoriteAvailable',
        data: newFavoriteAvailable,
      });
    }

    this.favorite = items;
  }

  private async refreshToken() {
    if (!this.refresh_token || !this.access_token) return;

    await apiClient
      .refreshToken({
        refreshToken: this.refresh_token,
        accessToken: this.access_token,
      })
      .then(async ({ access_token, refresh_token }) => {
        await this.setAuth({
          access_token: access_token,
          refresh_token: refresh_token,
        });
      });
  }

  private async loop() {
    const timestamp = new Date().getTime();

    if (
      timestamp - this.timestamp_refresh_token >
      this.authenticationIntervalInMs
    ) {
      await this.refreshToken();
      this.timestamp_refresh_token = timestamp;
      this.authenticationIntervalInMs =
        parseInt(env.AUTHENTICATION_INTERVAL_IN_MS) * random(50, 150) * 0.01;
    }

    if (timestamp - this.timestamp_get_favorite > this.getItemsIntervalInMs) {
      await this.getFavorite();
      this.timestamp_get_favorite = timestamp;
      this.getItemsIntervalInMs =
        parseInt(env.GET_ITEMS_INTERVAL_IN_MS) * random(50, 150) * 0.01;
    }

    setTimeout(() => {
      if (this.loopIsRunning) void this.loop();
    }, 100);
  }

  private sendNotification(notification: Notification) {
    if (this.telegram) {
      this.telegram.send(notification);
    }

    if (this.console) {
      this.console.send(notification);
    }

    if (this.desktop) {
      this.desktop.send(notification);
    }

    if (this.discord) {
      this.discord.send(notification);
    }
  }

  private startLoop() {
    this.loopIsRunning = true;
    void this.loop();
  }

  private stopLoop() {
    this.loopIsRunning = false;
  }
}

new Core();

const server = http.createServer();
server.listen(process.env.PORT);
