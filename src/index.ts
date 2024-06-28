import { DBase } from "./database"
import { consola } from "consola/basic"

const console = consola.withTag("master")
console.info(`Starting Hakkuun...`)




process.on("SIGINT",() => {
    console.log("Waiting for workers to terminate...")
    DBase.close()
})