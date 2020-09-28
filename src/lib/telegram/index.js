import { Connect, Item } from './../../services/API'
import Config from './../../../config'
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

      this.setChatId(ctx.chat)

      // Reply
      ctx.reply(`Welcome ${ctx.chat.first_name} !\nDon't worry, I'll let you know if there are new stocks. :)`)
    })

    // Stop
    this.bot.command('stop', (ctx) => {
      this.isStarted = false

      this.removeChatId(ctx.chat)

      // Reply
      ctx.reply(`Bye ${ctx.chat.first_name} !\nI remain available if you need me.\n/start - If you want to receive the new stocks available.`)
    })

    // Help
    this.bot.help((ctx) => ctx.reply('/start - If you want to receive the new stocks available.\n/stop - If you want to stop receiving new stocks available.'))
    
    this.bot.launch()
  }

  initEvent() {
    this.eventEmitter.on('favoriteAvailable', this.sendMessage.bind(this));
  }

  async initStorage() {
    this.chatsId = await this.storage.get('chatsId') || []
  }

  async setChatId(chat) {
    if(!this.chatsId.includes(chat.id)) {
      this.chatsId.push(chat.id)

      console.log("----------")
      console.log(`New user: ${chat.first_name} ${chat.last_name || ''}`)

      await this.storage.put('chatsId', this.chatsId)
    }
  }

  async removeChatId(chat) {
    this.chatsId = this.chatsId.filter(item => item !== chat.id)

    console.log("----------")
    console.log(`User left: ${chat.first_name} ${chat.last_name || ''}`)

    await this.storage.put('chatsId', this.chatsId)
  }

  sendMessage(data) {
    for (let i = 0; i < this.chatsId.length; i++) {
      const chatId = this.chatsId[i];
      
      this.bot.telegram.sendMessage(chatId, data)
    }
  }
}

export default Telegram