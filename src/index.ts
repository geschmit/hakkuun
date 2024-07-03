import { Cache_DescheduleSync, Cache_ScheduleSync, dbCache } from "./db/cache"
import { consola } from "consola/basic"
import { StartHTTPServer, StopHTTPServer } from "./server"
import { Data_GetBotSecrets } from "./db/data"
import { CreateBot } from "./bot"

const console = consola.withTag("master")
console.info(`Starting Hakkuun...`)

StartHTTPServer()
for (const x of Data_GetBotSecrets()) {
    await CreateBot(x)
}
Cache_ScheduleSync(new Date(Date.now()+parseInt(Bun.env["SYNC_MS"] || "NaN")))

process.on("SIGINT",() => {
    console.info("Waiting for tasks to terminate...")
    Cache_DescheduleSync()
    StopHTTPServer()
    dbCache.close()
    
})