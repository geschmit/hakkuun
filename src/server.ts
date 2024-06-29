import { Hono } from "hono/tiny"
import { consola } from "consola/basic"
import type { Server } from "bun"
import { GetTutoCompletion } from "./database"

const console = consola.withTag("server")
const sessions:Array<Worker> = []
let server:Server

const SessionExists = (uid:string) => sessions.find((v:Worker,idx:number) => {v.name == uid})

const app = new Hono()
app.post("/api/sessions/start",(c) => {
    const uid = c.req.header("user_id")
    if (!uid || uid == "") { return c.text("",400) }
    if (SessionExists(uid)) {
        return c.json({
            response_type: "ephemeral",
            text: "A session is already active."
        })
    }

    if (GetTutoCompletion(uid) == false) {
        // start tutorial

    }

    return c.text('wawa')
})

app.post("/api/sessions/stop",(c) => {
    const uid = c.req.header("user_id")
    if (!uid || uid == "") { return c.text("",400) }
    const session = SessionExists(uid)
    if (!session) {
        return c.json({
            response_type: "ephemeral",
            text: "A session is not currently active."
        })
    }
    session.terminate()
    return c.json({
        response_type: "ephemeral",
        text: "Your session was forfeited."
    })
})

export const StartHTTPServer = () => {
    server = Bun.serve(app)
    console.info(`Server listening for requests on :${server.port}`)
}

export const StopHTTPServer = () => {
    console.info(`HTTP server shutting down...`)
    server.stop()
}