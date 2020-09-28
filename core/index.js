import DataManager from './../lib/dataManager'
import Telegram from './../lib/telegram'
import EventEmitter from 'events'
import Storage from 'node-storage'

class Core {
  constructor() {
    this.init()
  }

  async init() {
    this.storage = await new Storage('.storage/data');

    this.eventEmitter = await new EventEmitter();

    this.dataManager = new DataManager({ eventEmitter: this.eventEmitter, storage: this.storage })
    this.telegram = new Telegram({ eventEmitter: this.eventEmitter, storage: this.storage })
  }

  // Update function of the loop
  /*update(progress) {
    // Defined function
    var timestamp = new Date().getTime();
    
    console.log(progress)
  }*/

  // Loop function
  /*loop(timestamp = new Date().getTime()) {
    var progress = (timestamp - this.lastRender);

    this.update(progress);
    
    this.lastRender = timestamp;
    
    setTimeout(() => {
      if (this.loopFlag) this.loop();
    }, 100)
  }*/

  // Start the loop
  //startLoop() { this.loopFlag = true; this.loop(); }

  // Stop the loop
  //stopLoop() {  this.loopFlag = false }
}

export default Core