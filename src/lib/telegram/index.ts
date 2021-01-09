import Config from './../../../config/config'
import { Context, Telegraf } from 'telegraf'
import { EventEmitter } from 'events'
// @ts-ignore
import Storage from 'node-storage'
import { Chat } from 'telegraf/typings/telegram-types'

interface MyContext extends Context {
  
}

type TelegramType = {
  eventEmitter: EventEmitter
  storage: Storage
}

class Telegram {
  eventEmitter: EventEmitter
  storage: Storage

  bot: Telegraf<MyContext>
  isStarted: boolean
  chatsId: number[]

  constructor({ eventEmitter, storage }: TelegramType) {
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
      if(!ctx.chat) return

      this.isStarted = true

      this.setChatId(ctx.chat)

      // Reply
      ctx.reply(`Welcome ${ctx.chat.first_name} !\nDon't worry, I'll let you know if there are new stocks. :)`)
    })

    // Stop
    this.bot.command('stop', (ctx) => {
      if(!ctx.chat) return

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

  async setChatId(chat: Chat) {
    if(!this.chatsId.includes(chat.id)) {
      this.chatsId.push(chat.id)

      console.log("----------")
      console.log(`New user: ${chat.first_name} ${chat.last_name || ''}`)

      await this.storage.put('chatsId', this.chatsId)
    }
  }

  async removeChatId(chat: Chat) {
    this.chatsId = this.chatsId.filter(item => item !== chat.id)

    console.log("----------")
    console.log(`User left: ${chat.first_name} ${chat.last_name || ''}`)

    await this.storage.put('chatsId', this.chatsId)
  }

  sendMessage(data: string) {
    for (let i = 0; i < this.chatsId.length; i++) {
      const chatId = this.chatsId[i];
      
      this.bot.telegram.sendMessage(chatId, data)
    }
  }
}

export default Telegram