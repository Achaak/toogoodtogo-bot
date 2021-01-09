import { connect, getFavorite, refresh, /*Item*/ } from './../../services/API'
import Config from './../../../config/config'
import isEqual from 'lodash.isequal'
import { EventEmitter } from 'events'

type  DataManagerType = {
  eventEmitter: EventEmitter
}

class DataManager {
  eventEmitter: EventEmitter

  access_token: string | null
  refresh_token: string | null
  user: {
    user_id: number
  } | null

  lastRender: number | undefined
  loopFlag: boolean

  favorite: {
    store: {
      store_name: string
      store_location: {
        address: {
          address_line: string
        }
      }
    },
    items_available: number
  }[]

  favoriteEnable: {
    store_name: string
    items_available: number
  }[]

  timestamp_get_favorite: number
  timestamp_refresh_token: number

  constructor({ eventEmitter }: DataManagerType) {
    this.eventEmitter = eventEmitter

    this.access_token = null
    this.refresh_token = null
    this.user = null

    this.lastRender = undefined
    this.loopFlag = false

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
    connect().then(res => {
      // Get data
      const data = res.data

      console.log("Your are connected.")
      
      if(res.status === 200) {
        this.access_token = data.access_token
        this.refresh_token = data.refresh_token
        this.user = data.startup_data.user

        // Start the loop
        this.startLoop()
      }
    }).catch(() => {
      console.log("Your email or password is incorrect.")
    })
  }

  // Update functeventn of the loop
  update() {
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
    if(!this.access_token) return
    if(!this.user) return

    getFavorite({userId: this.user.user_id, accessToken: this.access_token}).then(res => {
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
    if(!this.refresh_token) return 

    refresh({refreshToken: this.refresh_token}).then(res => {
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
    const _favoriteAvailable = [...this.favorite].filter((item) => {
      return item.items_available > 0
    }).map(item => {
      return {
        store_name: item.store.store_name,
        items_available: item.items_available
      }
    })

    // If favorite available change
    if(!isEqual(_favoriteAvailable, this.favoriteEnable)) {
      this.favoriteEnable = _favoriteAvailable

      // Format message
      let messageFormated = _favoriteAvailable.map(item => {
        return `${item.store_name}: ${item.items_available}`
      })

      this.eventEmitter.emit('favoriteAvailable', messageFormated.join('\n'));
    }
  }

  // Loop functeventn
  loop(timestamp = new Date().getTime()) {
    this.update();
    
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