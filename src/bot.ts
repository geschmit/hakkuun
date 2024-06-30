import { App } from "@slack/bolt"
import { SessionExists, type Session } from "./session"
import { consola } from "consola"

const console = consola.withTag("bot")

interface BotCredentials {
    signingSecret:string,
    token:string,
    appToken:string,
    socketMode:true
}

interface Bot {
    app:App,
    start:Date,
    handling:Array<Session>
    uid:string
}

const bots:Array<Bot> = []

export const CreateBot = async (botCreds:BotCredentials) => {
    let bot:Bot = {
        uid: Math.floor(Math.random()*1e9).toString(16).substring(0,7),
        app: new App(botCreds),
        start: new Date(),
        handling:[]
    }

    try {
        await bot.app.start()
        console.warn(`[bot@${bot.uid}] Bot logged in and ready to submit responses`)
        bots.push(bot)
    } catch(err) {
        console.error(err)
    }
}

export const AssignBot = (bot:Bot,sesh:Session) => {
    if (SessionExists(sesh.uid,bot.handling)) {
        console.warn(`[bot@${bot.uid}] Tried to accept duplicate session for user ${sesh.uid}`)
        return
    }
    
}

export const FindBestCanidate = ():Bot => {
    bots.sort((a,b) => a.handling.length-b.handling.length)
    return bots[0]
}