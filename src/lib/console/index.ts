import { EventEmitter } from "events";

type ConsoleType = {
  eventEmitter: EventEmitter
}

class Console {
  eventEmitter: EventEmitter
  
  constructor({ eventEmitter }: ConsoleType) {
    this.eventEmitter = eventEmitter

    this.init()
  }

  async init() {
    this.initEvent()
  }

  initEvent() {
    this.eventEmitter.on('favoriteAvailable', this.sendMessage.bind(this));
  }

  sendMessage(data: string) {
    console.log("----------")
    console.log(data)
  }
}

export default Console