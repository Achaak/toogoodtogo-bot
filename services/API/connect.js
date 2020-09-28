
import { api } from "./config"
import config from "./../../config"

const connect = () =>
  api.post("auth/v1/loginByEmail", {
    "device_type": "UNKNOWN",
    "email": config.api.credentials.email,
    "password": config.api.credentials.password
  })

export default {
  connect,
}