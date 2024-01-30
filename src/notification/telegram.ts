import { type Context, Telegraf } from 'telegraf';
import { getData, setData } from '../store.js';
import { env } from '../env/server.js';
import { type Notification } from '../types/notification.js';
import { formatPickupInterval } from '../utils/date.js';
import { formatCurrency } from '../utils/currency.js';

type MyContext = Context;

export class Telegram {
  private bot: Telegraf = new Telegraf(env.NOTIFICATIONS_TELEGRAM_BOT_TOKEN);
  private chatsId: number[] = [];

  constructor() {
    void this.init();
  }

  send(notification: Notification) {
    switch (notification.type) {
      case 'newFavoriteAvailable':
        this.sendNewFavoriteAvailable(notification);
        break;
    }
  }

  private async init() {
    await this.initStorage();
    await this.initTelegramBot();
  }

  private async initTelegramBot() {
    // Start
    this.bot
      .start(async (ctx) => {
        if (!ctx.chat) return;

        await this.setChatId(ctx);

        // Reply
        await ctx
          .reply(
            `Welcome ${ctx.from?.first_name} !\nDon't worry, I'll let you know if there are new stocks. :)`
          )
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });

    // Stop
    this.bot
      .command('stop', async (ctx) => {
        if (!ctx.chat) return;

        await this.removeChatId(ctx);

        // Reply
        await ctx
          .reply(
            `Bye ${ctx.from?.first_name} !\nI remain available if you need me.\n/start - If you want to receive the new stocks available.`
          )
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });

    // Help
    this.bot
      .help((ctx) =>
        ctx.reply(
          '/start - If you want to receive the new stocks available.\n/stop - If you want to stop receiving new stocks available.'
        )
      )
      .catch((error) => {
        console.error(error);
      });

    await this.bot.launch();
  }

  private async initStorage() {
    this.chatsId = (await getData('chatsId')) ?? [];
  }

  private async setChatId(ctx: MyContext) {
    if (ctx.from?.id && !this.chatsId.includes(ctx.from?.id)) {
      this.chatsId.push(ctx.from?.id);

      console.log('--------------------');
      console.log(
        `New user: ${ctx.from?.first_name} ${ctx.from?.last_name ?? ''}`
      );

      await setData('chatsId', this.chatsId);
    }
  }

  private async removeChatId(ctx: MyContext) {
    this.chatsId = this.chatsId.filter((item) => item !== ctx.from?.id);

    console.log('--------------------');
    console.log(
      `User left: ${ctx.from?.first_name} ${ctx.from?.last_name ?? ''}`
    );

    await setData('chatsId', this.chatsId);
  }

  private sendNewFavoriteAvailable(notification: Notification) {
    for (const chatId of this.chatsId) {
      for (const item of notification.data) {
        void this.bot.telegram
          .sendMessage(
            chatId,
            `<b>${item.display_name}</b>\nAvailable: ${item.items_available}\n${formatCurrency(
              item.item.price_including_taxes.minor_units,
              item.item.price_including_taxes.decimals,
              item.item.price_including_taxes.code
            )}\n${formatPickupInterval(item.pickup_interval)}`,
            {
              parse_mode: 'HTML',
            }
          )
          .catch((error) => {
            console.error(error);
          });
      }
    }
  }
}
