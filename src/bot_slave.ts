import { consola } from "consola/basic"
import { App } from "@slack/bolt"

declare var self:Worker
const console = consola.withTag(self.name)
let isMaster = false
let app:App;

export interface AppConfigSlave {
    signingSecret: string,
    token: string,
    appToken: string,
    scenarios: {[name:string]:string}|undefined
}

const Initialize = async (config:AppConfigSlave) => {
    app = new App({
        token: config.token,
        appToken: config.appToken,
        signingSecret: config.signingSecret
    })

    try {
        await app.start()
    } catch(err) {
        console.error(err)
    }
}

self.onmessage = async (ev:MessageEvent) => {
    const request:string = ev.data[0]
    switch (request) {
        case "INITIALIZE":
            await Initialize(ev.data[1])
            break

        default:
            console.warn(`Received unknown instruction "${request}", discarding`)
            break
    }
}

process.on("beforeExit", async () => {
    console.info("Worker shutting down...")
    await app.stop()
    
})

console.info("Worker process spawned")