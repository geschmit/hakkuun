import { consola } from "consola/basic"
import { App } from "@slack/bolt"
import { Bot } from "./bot"

declare var self:Worker
const console = consola.withTag(self.name)
let bot:Bot


