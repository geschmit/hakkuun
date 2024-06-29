import { Database } from "bun:sqlite"
import { consola } from "consola/basic"

const console = consola.withTag("database")
export const DBase = new Database(":memory:")

//const queryMinutes = DBase.query("")
export const GetMinutes = async () => {
    // todo airtable api
}

export const GetTutoCompletion = (uid:string):boolean => {

}