import { clear } from "console";
import { EventEmitter } from "events";
import { env } from "./../../env/server.js";

type ConsoleType = {
  eventEmitter: EventEmitter;
};

class Console {
  eventEmitter: EventEmitter;

  constructor({ eventEmitter }: ConsoleType) {
    this.eventEmitter = eventEmitter;

    this.init();
  }

  async init() {
    this.initEvent();
  }

  initEvent() {
    this.eventEmitter.on("favorite-notification", this.sendMessage.bind(this));
  }

  sendMessage(data: string) {
    if (env.NOTIFICATIONS_CONSOLE_CLEAR === "true") {
      clear();
    } else {
      console.log("--------------------");
    }
    console.log(data);
  }
}

export default Console;
