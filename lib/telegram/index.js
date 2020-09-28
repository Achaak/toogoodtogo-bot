import { Connect, Item } from './../../services/API'
import Config from './../../config'
import Telegraf from 'telegraf'

class Telegram {
  constructor({ eventEmitter, storage }) {
    this.eventEmitter = eventEmitter
    this.storage = storage
    
    this.bot = new Telegraf(Config.notifications.telegram.bot_token)
    this.isStarted = false
    this.chatsId = []

    this.init()
  }

  async init() {
    await this.initStorage()
    this.initTelegramBot()
    this.initEvent()
  }

  initTelegramBot() {
    // Start
    this.bot.start((ctx) => {
      this.isStarted = true

      if(!this.chatsId.includes(ctx.chat.id)) {
        this.setChatId(ctx.chat.id)
      }

      // Reply
      ctx.reply('Welcome!')
    })

    // Stop
    this.bot.command('stop', (ctx) => {
      this.isStarted = false

      // Reply
      ctx.reply('Bye!')
    })

    // Help
    this.bot.help((ctx) => ctx.reply('Send me a sticker'))
    
    this.bot.launch()
  }

  initEvent() {
    this.eventEmitter.on('sendMessage', this.sendMessage.bind(this));
  }

  async initStorage() {
    this.chatsId = await this.storage.get('chatsId') || []
  }

  async setChatId(id) {
    this.chatsId.push(id)

    await this.storage.put('chatsId', this.chatsId)
  }

  sendMessage(data) {
    for (let i = 0; i < this.chatsId.length; i++) {
      const chatId = this.chatsId[i];
      
      this.bot.telegram.sendMessage(chatId, "message")
    }
  }
}

export default Telegram