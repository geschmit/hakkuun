import { cache } from "./db/cache"
import { consola } from "consola/basic"
import { StartHTTPServer, StopHTTPServer } from "./server"

const console = consola.withTag("master")
console.info(`Starting Hakkuun...`)

StartHTTPServer()

process.on("SIGINT",() => {
    console.info("Waiting for tasks to terminate...")
    StopHTTPServer()
    cache.close()
    
})