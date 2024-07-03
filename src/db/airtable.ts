import Airtable from "airtable"
import { consola } from "consola/basic"
import type { CachedUser } from "./cache"
import {createDecipheriv} from "crypto"

const console = consola.withTag("db.airtable")


// ! i've never worked with airtable in my entire life. this code
// ! may or may not be accurate to anything in the original repo
//const airtable = new Airtable({apiKey:Bun.env["AIRTABLE_KEY"] || ""})
//    .base("app4kCWulfB02bV8Q")
//const atHours = airtable("Users")

export const AT_SyncUserToCache = (uid:string):CachedUser => {
    
}