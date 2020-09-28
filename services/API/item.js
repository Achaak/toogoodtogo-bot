import { api } from "./config"

const getFavorite = ({userId, accessToken}) =>
  api.post("item/v5/", {
    favorites_only: true,
    origin: {
      latitude: 52.5170365,
      longitude: 13.3888599,
    },
    radius: 200,
    user_id: userId,
  }, {
    headers: { Authorization: `Bearer ${accessToken}` },
    validateStatus: false
  })

export default {
  getFavorite,
}

