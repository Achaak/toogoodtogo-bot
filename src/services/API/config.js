import axios from "axios";
import config from "./../../../config"

const api = axios.create({
  baseURL: 'https://apptoogoodtogo.com/api/',
  timeout: 1000,
  headers: {
    "User-Agent": config.api.headers["User-Agent"],
    "Content-Type": "application/json",
    Accept: "application/json",
    "Accept-Language": "en-US",
  },
  responseType: "json",
  resolveBodyOnly: true,
});

export {
  api
}