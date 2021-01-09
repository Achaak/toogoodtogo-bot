import { EventEmitter } from 'events';
import notifier  from 'node-notifier'

type DesktopType = {
  eventEmitter: EventEmitter
}

class Desktop {
  eventEmitter: EventEmitter

  constructor({ eventEmitter }: DesktopType) {
    this.eventEmitter = eventEmitter

    this.init()
  }

  async init() {
    this.initEvent()
  }

  initEvent() {
    this.eventEmitter.on('favorite-notification', this.sendFavoriteAvailableMessage.bind(this));
  }

  sendFavoriteAvailableMessage(data: string) {
    notifier.notify({
      title: 'New stocks available',
      message: data
    });
  }
}
  
export default Desktop