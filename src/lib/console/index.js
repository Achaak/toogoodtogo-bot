class Console {
  constructor({ eventEmitter }) {
    this.eventEmitter = eventEmitter

    this.init()
  }

  async init() {
    this.initEvent()
  }

  initEvent() {
    this.eventEmitter.on('favoriteAvailable', this.sendMessage.bind(this));
  }

  sendMessage(data) {
    console.log("----------")
    console.log(data)
  }
}

export default Console