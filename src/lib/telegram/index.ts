import Config from "../../../config/config.js";
import { Context, Telegraf } from "telegraf";
import { EventEmitter } from "events";
import { getData, setData } from "./../../store/datastore.js";

interface MyContext extends Context {}

type TelegramType = {
  eventEmitter: EventEmitter;
};

class Telegram {
  eventEmitter: EventEmitter;

  bot: Telegraf<MyContext>;
  isStarted: boolean;
  chatsId: number[];

  constructor({ eventEmitter }: TelegramType) {
    this.eventEmitter = eventEmitter;

    this.bot = new Telegraf(Config.notifications.telegram.bot_token);
    this.isStarted = false;
    this.chatsId = [];

    this.init();
  }

  async init() {
    await this.initStorage();
    this.initTelegramBot();
    this.initEvent();
  }

  initTelegramBot() {
    // Start
    this.bot.start((ctx) => {
      if (!ctx.chat) return;

      this.isStarted = true;

      this.setChatId(ctx);

      // Reply
      ctx.reply(
        `Welcome ${ctx.from?.first_name} !\nDon't worry, I'll let you know if there are new stocks. :)`
      );
    });

    // Stop
    this.bot.command("stop", (ctx) => {
      if (!ctx.chat) return;

      this.isStarted = false;

      this.removeChatId(ctx);

      // Reply
      ctx.reply(
        `Bye ${ctx.from?.first_name} !\nI remain available if you need me.\n/start - If you want to receive the new stocks available.`
      );
    });

    // Help
    this.bot.help((ctx) =>
      ctx.reply(
        "/start - If you want to receive the new stocks available.\n/stop - If you want to stop receiving new stocks available."
      )
    );

    this.bot.launch();
  }

  initEvent() {
    this.eventEmitter.on("favorite-notification", this.sendMessage.bind(this));
  }

  async initStorage() {
    this.chatsId = (await getData("chatsId")) || [];
  }

  async setChatId(ctx: MyContext) {
    if (ctx.from?.id && !this.chatsId.includes(ctx.from?.id)) {
      this.chatsId.push(ctx.from?.id);

      console.log("--------------------");
      console.log(
        `New user: ${ctx.from?.first_name} ${ctx.from?.last_name || ""}`
      );

      await setData("chatsId", this.chatsId);
    }
  }

  async removeChatId(ctx: MyContext) {
    this.chatsId = this.chatsId.filter((item) => item !== ctx.from?.id);

    console.log("--------------------");
    console.log(
      `User left: ${ctx.from?.first_name} ${ctx.from?.last_name || ""}`
    );

    await setData("chatsId", this.chatsId);
  }

  sendMessage(data: string) {
    for (let i = 0; i < this.chatsId.length; i++) {
      const chatId = this.chatsId[i];

      this.bot.telegram.sendMessage(chatId, data);
    }
  }
}

export default Telegram;
