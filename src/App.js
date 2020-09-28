import http from "http"
import core from "./core/index.js"

const server = http.createServer()

// Start core
const Core = new core()

server.listen(8080)