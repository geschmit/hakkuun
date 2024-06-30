import { App } from "@slack/bolt"
import type { Session } from "./session"

interface BotCredentials {
    signingSecret:string,
    token:string,
    appToken:string,
    socketMode:true
}

interface Bot {
    app:App,
    handling:Array<Session>
}

const bots:Array<Bot> = []

export const CreateBot = (botCreds:BotCredentials) => {
    let bot:Bot = {
        app: new App(botCreds),
        handling:[]
    }
    bots.push(bot)
}

export const AssignSession = (bot:Bot,sesh:Session) => {
    
}

export const FindBestCanidate = ():Bot => {
    bots.sort((a,b) => a.handling.length-b.handling.length)
    return bots[0]
}