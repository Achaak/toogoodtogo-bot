import DataManager from './../lib/dataManager'
import Telegram from './../lib/telegram'
import Console from './../lib/console'
import Desktop from './../lib/desktop'
import { EventEmitter } from 'events'
// @ts-ignore
import Storage from 'node-storage'
import Config from './../../config/config'

class Core {
  storage: Storage | null
  eventEmitter: EventEmitter | null

  dataManager: DataManager | null

  telegram: Telegram | null
  console: Console | null
  desktop: Desktop | null

  constructor() {
    this.storage = null
    this.eventEmitter = null

    this.dataManager = null

    this.telegram = null
    this.console = null
    this.desktop = null

    this.init()
  }

  async init() {
    this.storage = await new Storage('.storage/data');
    this.eventEmitter = await new EventEmitter();

    this.dataManager = new DataManager({ eventEmitter: this.eventEmitter })

    if(Config.notifications.telegram.enabled)
      this.telegram = new Telegram({ eventEmitter: this.eventEmitter, storage: this.storage })

    if(Config.notifications.console.enabled)
      this.console = new Console({ eventEmitter: this.eventEmitter })

    if(Config.notifications.desktop.enabled)
      this.desktop = new Desktop({ eventEmitter: this.eventEmitter })
  }
}

export default Core