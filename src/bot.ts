import { consola } from "consola/basic"
import { App } from "@slack/bolt"

export interface SlackSecrets {
    signingSecret: string,
    token:string,
    appToken:string
}

export class Bot {
    public readonly app:App
    constructor(secrets:SlackSecrets) {
        this.app = new App(secrets)
    }
    
    async start() {
        this.app.start(3000)
        
    }
}