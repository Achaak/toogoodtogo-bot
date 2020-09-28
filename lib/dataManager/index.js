import { Connect, Item } from './../../services/API'
import Config from './../../config'
import _ from 'lodash'

class DataManager {
  constructor({ eventEmitter, storage }) {
    this.eventEmitter = eventEmitter
    this.storage = storage

    this.access_token = null
    this.refresh_token = null
    this.user = null

    this.favorite = []
    this.favoriteEnable = []

    this.timestamp_get_favorite = 0

    this.init()
  }

  async init() {
    this.connect()
  }

  connect() {
    Connect.connect().then(res => {
      // Get data
      const data = res.data
      
      if(res.status === 200) {
        this.access_token = data.access_token
        this.refresh_token = data.refresh_token
        this.user = data.startup_data.user

        // Start the loop
        this.startLoop()
      }
    })
  }

  // Update functeventn of the loop
  update(progress) {
    // Defined functeventn
    var timestamp = new Date().getTime();

    if(timestamp - this.timestamp_get_favorite > Config.api.pollingIntervalInMs) {
      this.getFavorite()
      this.timestamp_get_favorite = timestamp
    }
  }

  getFavorite() {
    Item.getFavorite({userId: this.user.user_id, accessToken: this.access_token}).then(res => {
      // Get data
      const data = res.data
      
      if(res.status === 200) {
        this.favorite = data.items
        
        // Format all favorite
        this.formatFavorite()
      }
    })
  }

  formatFavorite() {
    const _favoriteEnable = this.favorite.filter((item) => {
      return item.items_available > 0
    })

    if(!_.isEqual(_favoriteEnable, this.favoriteEnable))
      this.eventEmitter.emit('sendMessage');
  }

  // Loop functeventn
  loop(timestamp = new Date().getTime()) {
    var progress = (timestamp - this.lastRender);

    this.update(progress);
    
    this.lastRender = timestamp;
    
    setTimeout(() => {
      if (this.loopFlag) this.loop();
    }, 100)
  }

  // Start the loop
  startLoop() { this.loopFlag = true; this.loop(); }

  // Stop the loop
  stopLoop() {  this.loopFlag = false }
}

export default DataManager