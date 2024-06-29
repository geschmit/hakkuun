import { Hono } from "hono/tiny"
import { consola } from "consola/basic"
import type { Server } from "bun"

const console = consola.withTag("server")
let server:Server

const app = new Hono()
app.post("/api/start",(c) => {
    // NOT DONE UYET
})

export const StartHTTPServer = () => {
    server = Bun.serve(app)
    console.info(`Server listening for requests on :${server.port}`)
}

export const StopHTTPServer = () => {
    console.info(`HTTP server shutting down...`)
    server.stop()
}