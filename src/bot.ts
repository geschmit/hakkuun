import { App } from "@slack/bolt"
import { SessionExists, type Session, type SessionTransportPacket } from "./session"
import { consola } from "consola"

const console = consola.withTag("bot")

export interface BotCredentials {
    signingSecret:string,
    token:string,
    appToken:string,
    socketMode:true
}

export interface Bot {
    app:App,
    start:Date,
    handling:Array<Session>
    uid:string
}

const bots:Array<Bot> = []

export const CreateBot = async (botCreds:BotCredentials):Promise<Bot> => {
    let bot:Bot = {
        uid: Math.floor(Math.random()*1e9).toString(16).substring(0,7),
        app: new App(botCreds),
        start: new Date(),
        handling:[]
    }

    try {
        await bot.app.start()
        console.info(`[bot@${bot.uid}] Bot logged in and ready to submit responses`)
        bots.push(bot)
    } catch(err) {
        console.error(err)
    }

    return bot
}

export const AssignBot = (bot:Bot,sesh:Session) => {
    const logger = console.withTag(`[bot@${bot.uid}]`)
    if (SessionExists(sesh.uid,bot.handling)) {
        logger.warn(`Tried to accept duplicate session for user ${sesh.uid}`)
        return
    }
    sesh.bot = bot
    sesh.worker.addEventListener("message", (msg) => {
        const data:SessionTransportPacket = msg.data
        if (data[0].substring(0,3) != "bot") { return }
        switch (data[0]) {
            case "bot.sendMessage":
                
                break

            default:
                logger.warn(`Command "${data[0]}" is not a valid command, discarding`)
                break
        }
    })
}

export const FindBestCanidate = ():Bot => {
    bots.sort((a,b) => a.handling.length-b.handling.length)
    return bots[0]
}