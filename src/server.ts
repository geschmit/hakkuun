import { Hono } from "hono/tiny"
import { consola } from "consola/basic"
import type { Server } from "bun"
import { SessionExists } from "./session"
import { Cache_GetUser } from "./db/cache"

const console = consola.withTag("server")
let server:Server

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

    if (Cache_GetUser(uid).hours == 0) {
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
    return c.json({
        response_type: "ephemeral",
        text: ":rac_pf: Your session was forfeited!"
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