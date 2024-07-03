import { Database } from "bun:sqlite"
import { createDecipheriv } from "crypto"
import { consola } from "consola/basic"
import type { BotCredentials } from "../bot"

const console = consola.withTag("db.sql.data")

export const dbData = new Database(Bun.env["DATA_DB_PATH"] || "")
const dataPersona = dbData.prepare("select ? from BotPersonas where uid=?")

export const Data_GetBotSecrets = ():Array<BotCredentials> => {
    const creds:Array<BotCredentials> = []
    const query = dbData.prepare("select * from BotCredentials")
    const queryRes = (query.all() as Array<{[field:string]:string}>)
    for (const x of queryRes) {
        delete x["uid"]
        creds.push(x as unknown as BotCredentials)
    }
    return creds
}

export const Data_GetBotPersonaText = (uid:string,field:string): string => {
    const queryRes = dataPersona.get(field,uid)
    if (queryRes == null) {
        console.error(`Attempted to index nonexistant persona field ${field} for uid ${uid}`)
        return ""
    }
}