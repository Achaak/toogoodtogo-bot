import notifier  from 'node-notifier'

class Desktop {
  constructor({ eventEmitter }) {
    this.eventEmitter = eventEmitter

    this.init()
  }

  async init() {
    this.initEvent()
  }

  initEvent() {
    this.eventEmitter.on('favoriteAvailable', this.sendFavoriteAvailableMessage.bind(this));
  }

  sendFavoriteAvailableMessage(data) {
    notifier.notify({
      title: 'New stocks available',
      message: data
    });
  }
}
  
export default Desktop