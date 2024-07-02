import { Database } from "bun:sqlite"
import { consola } from "consola/basic"
import type { BotCredentials } from "../bot"
import { AT_SyncUserToCache } from "./airtable"

const console = consola.withTag("db.sql.cache")

export const cache = new Database(Bun.env["CACHE_DB_PATH"] || "")
const ceUser = cache.query("select * from UserCache where uid=?")

export interface CachedUser {
    uid:string,
    hours:number,
    meta: {
        createdAt:Date,
        syncGroup:string
    }
}

//const queryMinutes = DBase.query("")


export const Cache_GetUser = (uid:string):CachedUser => {
    let usr:any = ceUser.get(uid)
    if (usr == null) {
        return AT_SyncUserToCache(uid)
    }
}

export const Cache_GetTutoCompletion = (uid:string):boolean => (Cache_GetUser(uid).hours > 0)
