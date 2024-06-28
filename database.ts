import { Database } from "bun:sqlite";

export const DBase = new Database(":memory:")

const queryMinutes = DBase.query("")
export const GetMinutes = async () => {
    // todo airtable api
}