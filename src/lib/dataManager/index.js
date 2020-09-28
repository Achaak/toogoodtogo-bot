import { Connect, Item } from './../../services/API'
import Config from './../../../config'
import _ from 'lodash'

class DataManager {
  constructor({ eventEmitter }) {
    this.eventEmitter = eventEmitter

    this.access_token = null
    this.refresh_token = null
    this.user = null

    this.favorite = []
    this.favoriteEnable = []

    this.timestamp_get_favorite = 0
    this.timestamp_refresh_token = 0

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
    
    if(timestamp - this.timestamp_refresh_token > Config.api.authenticationIntervalInMS) {
      this.refreshToken()
      this.timestamp_refresh_token = timestamp
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

  refreshToken() {
    Connect.refresh({refreshToken: this.refresh_token}).then(res => {
      // Get data
      const data = res.data
      
      if(res.status === 200) {
        this.access_token = data.access_token
        this.refresh_token = data.refresh_token
      }
    })
  }

  formatFavorite() {
    // Get favorite available
    let _favoriteAvailable = this.favorite.filter((item) => {
      return item.items_available > 0
    })

    // Format favorite
    _favoriteAvailable = _favoriteAvailable.map(item => {
      return {
        store_name: item.store.store_name,
        items_available: item.items_available
      }
    })

    // If favorite available change
    if(!_.isEqual(_favoriteAvailable, this.favoriteEnable)) {
      this.favoriteEnable = _favoriteAvailable

      // Format message
      let messageFormated = _favoriteAvailable.map(item => {
        return `${item.store_name}: ${item.items_available}`
      })
      messageFormated = messageFormated.join('\n')

      this.eventEmitter.emit('favoriteAvailable', messageFormated);
    }
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