import { Database } from "bun:sqlite"
import { createDecipheriv } from "crypto"
import { consola } from "consola/basic"
import type { BotCredentials } from "../bot"

const console = consola.withTag("db.sql.cache")

export const dbData = new Database(Bun.env["DATA_DB_PATH"] || "")

export const Data_GetBotSecrets = ():Array<BotCredentials> => {
    const creds:Array<BotCredentials> = []
    const query = dbData.prepare("select * from BotCredentials")
    const queryRes = (query.all() as Array<any>)
    for (const x of queryRes) {
        let rec:any = {}
        for (const y of Object.keys(x)) {
            if (y == "hash") { continue }
            // todo | may need optimization. I develop integrated circuits, not encryption standards

            // todo | by any sort of meaning this is most likely equal to burning a bible in front 
            // todo | of the pope by how godawful and ineffective this is to someone who knows
            // todo | how to implement this properly

            const [hash,tag] = (x[y] as string).split(".")
            const crypt = createDecipheriv("aes-256-gcm",Buffer.from(Bun.env["BOT_SECRET_KEY"]||"","utf-8"),Buffer.from(Bun.env["BOT_SECRET_IV"]||"","utf-8"))
            crypt.setAuthTag(Buffer.from(tag))
            const decr = crypt.update(x[y],"hex")
            rec[y] = crypt.final("utf-8")
        }
        const genHash = new Bun.SHA256()
            .update(`${rec["token"]}.${rec["appToken"]}.${rec["signingSecret"]}`)
            .digest("hex")

        const origHash = (x["hash"] as string)

        if (genHash != x["hash"]) {
            throw new Error(`Hash checksum has failed! (${origHash.substring(origHash.length-8,origHash.length)} != ${genHash.substring(genHash.length-8,genHash.length)})`)
        } else {
            console.info(`Hash checksum OK (${genHash.substring(genHash.length-8,genHash.length)})`)
        }
        
        creds.push(rec)
    }

    return creds
}