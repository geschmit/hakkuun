import { App, type Logger } from "@slack/bolt"
import { SessionExists, type Session, type SessionTransportPacket } from "./session"
import { consola, type ConsolaInstance } from "consola/basic"

const console = consola.withTag("bot")

export interface BotCredentials {
    socketMode: boolean
    signingSecret:string,
    token:string,
    appToken:string
}

export interface Bot {
    app:App,
    start:Date,
    handling:Array<Session>
    uid:string,
    logger:ConsolaInstance
}

const bots:Array<Bot> = []

export const CreateBot = async (botCreds:BotCredentials):Promise<Bot> => {
    const uid = Math.floor(Math.random()*1e9).toString(16).substring(0,7)
    let logger = console.withTag(uid)
    logger = {...logger,...{  // compatability with the slack logger so both us and bolt can use it
        getLevel: () => logger.level,
        setLevel: (level:number) => logger.level = level,
        setName: (name:string) => {}
    }} as unknown as ConsolaInstance
    let bot:Bot = {
        uid: uid,
        app: new App({...botCreds,...{socketMode:true,logger:(logger as unknown as Logger)}}),
        start: new Date(),
        handling:[],
        logger: logger
    }
    

    try {
        await bot.app.start()
        logger.info(`Bot logged in and ready to submit responses`)
        bots.push(bot)
    } catch(err) {
        console.error(err)
    }

    return bot
}

export const AssignBot = (bot:Bot,sesh:Session) => {
    const logger = console.withTag(`[bot@${bot.uid}]`)
    if (SessionExists(sesh.uid,bot.handling)) {
        logger.error(`Tried to accept duplicate session for user ${sesh.uid}`)
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