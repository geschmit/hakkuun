import { DBase } from "./database"


console.log("Starting...")


process.on("SIGINT",() => {
    console.log("Stopping...")
    DBase.close()
})