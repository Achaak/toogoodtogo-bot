import DataManager from "./../lib/dataManager/index.js";
import Telegram from "./../lib/telegram/index.js";
import Console from "./../lib/console/index.js";
import Desktop from "./../lib/desktop/index.js";
import { EventEmitter } from "events";
import { env } from "./../env/server.js";

class Core {
  eventEmitter: EventEmitter | null;

  dataManager: DataManager | null;

  telegram: Telegram | null;
  console: Console | null;
  desktop: Desktop | null;

  constructor() {
    this.eventEmitter = null;

    this.dataManager = null;

    this.telegram = null;
    this.console = null;
    this.desktop = null;

    this.init();
  }

  async init() {
    this.eventEmitter = await new EventEmitter();

    this.dataManager = new DataManager({ eventEmitter: this.eventEmitter });

    if (env.NOTIFICATIONS_TELEGRAM_ENABLED === "true")
      this.telegram = new Telegram({ eventEmitter: this.eventEmitter });

    if (env.NOTIFICATIONS_CONSOLE_ENABLED === "true")
      this.console = new Console({ eventEmitter: this.eventEmitter });

    if (env.NOTIFICATIONS_DESKTOP_ENABLED === "true")
      this.desktop = new Desktop({ eventEmitter: this.eventEmitter });
  }
}

export default Core;
