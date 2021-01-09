import { connect, getFavorite, refresh, /*Item*/ } from './../../services/API'
import Config from './../../../config/config'
import isEqual from 'lodash.isequal'
import { EventEmitter } from 'events'

type  DataManagerType = {
  eventEmitter: EventEmitter
}

class DataManager {
  eventEmitter: EventEmitter

  firstLoad: boolean

  access_token: string | null
  refresh_token: string | null
  user: {
    user_id: number
  } | null

  lastRender: number | undefined
  loopFlag: boolean

  favorite: {
    store: {
      store_id: string
      store_name: string
      store_location: {
        address: {
          address_line: string
        }
      }
    },
    items_available: number
  }[]

  favoriteAvailable: {
    store_id: string
    store_name: string
    items_available: number
  }[]

  favoriteEmpty: {
    store_id: string
    store_name: string
    items_available: number
  }[]

  timestamp_get_favorite: number
  timestamp_refresh_token: number

  constructor({ eventEmitter }: DataManagerType) {
    this.eventEmitter = eventEmitter
    
    this.firstLoad = true

    this.access_token = null
    this.refresh_token = null
    this.user = null

    this.lastRender = undefined
    this.loopFlag = false

    this.favorite = []
    this.favoriteAvailable = []
    this.favoriteEmpty = []

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
      return item.items_available !== 0
    }).map(item => {
      return {
        store_id: item.store.store_id,
        store_name: item.store.store_name,
        items_available: item.items_available
      }
    })
    
    // Get favorite for message
    const _favoriteNotification = [...this.favorite].filter((item) => {
      if(
        (item.items_available === 0 && this.favoriteEmpty.some(item2 => item.store.store_name === item2.store_name)) || 
        (item.items_available === 0 && this.firstLoad)
      ) {
        return false
      } else {
        return true
      }
    }).map(item => {
      return {
        store_id: item.store.store_id,
        store_name: item.store.store_name,
        items_available: item.items_available
      }
    })

    // Get new favorite empty
    const _favoriteEmpty = [...this.favorite].filter((item) => {
      return item.items_available === 0
    }).map(item => {
      return {
        store_id: item.store.store_id,
        store_name: item.store.store_name,
        items_available: item.items_available
      }
    })

    // If favorite available change
    if(!isEqual(_favoriteAvailable, this.favoriteAvailable)) {
      this.favoriteAvailable = _favoriteAvailable

      // Format message
      let messageFormated = _favoriteNotification.map(item => {
        return `${item.store_name}: ${item.items_available}`
      })

      this.eventEmitter.emit('favorite-notification', messageFormated.join('\n'));
    }

    // Set favorite empty
    this.favoriteEmpty = _favoriteEmpty

    this.firstLoad = false
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