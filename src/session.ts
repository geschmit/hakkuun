import type { App } from "@slack/bolt"
import { consola } from "consola/basic"
import { AssignSession, FindBestCanidate } from "./bot"
const console = consola.withTag("session")

export interface Session {
    uid:string,
    sessionType:string
    created:Date,
    bot:App
    worker:Worker
}

const sessions:Array<Session> = []

export const SessionExists = (uid:string,seshs:Array<Session>=sessions) => seshs.find((v:Session,idx:number) => {v.uid == uid})
export const CreateSession = (uid:string, type:string):Session|undefined => {
    if (SessionExists(uid)) {
        console.warn(`Attempted to spawn new session for uid ${uid} when session already exists`)
        return
    }
    console.info(`Spawning new session - [ uid ${uid}, sessionType "${type}" ]`)
    const bot = FindBestCanidate()
    let sesh:Session|any = {
        uid: uid,
        sessionType: type,
        created: new Date(),
        worker: new Worker(`./sessions/${type}.ts`,{name:`session] [${type}@${uid}`})
    }

    sesh.worker.addEventListener("open",() => {
        AssignSession(bot,sesh)
        sessions.push(sesh)
    })

    return sesh
}

export const TerminateSession = (uid:string) => {
    const sesh = SessionExists(uid)
    if (!sesh) {
        console.warn(`Attempted to terminate non-existant session for uid ${uid}`)
        return
    }
    sesh.worker.terminate()
}