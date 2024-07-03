import { Database } from "bun:sqlite"
import { consola } from "consola/basic"
import { AT_SyncUserToCache } from "./airtable"

export interface CachedUser {
    uid:string,
    hours:number,
    meta: {
        createdAt:Date,
        syncGroup:string
    }
}

const console = consola.withTag("db.sql.cache")
let syncGroup = ""
let syncTO:Timer|undefined

export const dbCache = new Database(Bun.env["CACHE_DB_PATH"] || "")
const ceUser = dbCache.query("select * from UserCache where uid=?")

export const Cache_ScheduleSync = (when:Date) => {
    const logger = console.withTag("cacheSync")
    syncTO = setTimeout(() => {
        syncTO = undefined
        logger.warn("*** AIRTABLE SYNC IN PROGRESS ***")

        logger.info("Disabling job control for workers...")

        logger.info("Rescheduling cache -> at sync...")
        Cache_ScheduleSync(new Date(Date.now()+parseInt(Bun.env["SYNC_MS"] || "NaN")))
        
        logger.warn("***  AIRTABLE SYNC COMPLETE   ***")
        
    },when.getTime()-Date.now())
    logger.info(`AirTable data sync will be performed at ${when.toLocaleTimeString("en-us",{timeZone:"UTC"})} UTC`)
}

export const Cache_DescheduleSync = () => {
    if (!syncTO) {
        console.error("Attempted to deschedule a sync while one was not scheduled or was in progress already")
        return
    }
    clearTimeout(syncTO)
}

export const Cache_GetUser = (uid:string):CachedUser => {
    let usr:any = ceUser.get(uid)
    if (usr == null) {
        return AT_SyncUserToCache(uid)
    } else {
        return {
            uid: usr["uid"],
            hours: usr["hours"],
            meta: {
                createdAt: new Date(usr["createdAt"]),
                syncGroup: syncGroup
            }
        }
    }
}

export const Cache_GetTutoCompletion = (uid:string):boolean => (Cache_GetUser(uid).hours > 0)
