import { Database } from "bun:sqlite";
declare var self: Worker;

export enum WorkerStatus {
    Starting,
    Idle,
    Working,
    Errored,
    Stopping,
    Dead
}

self.postMessage({
    status: WorkerStatus.Starting
})

const db = new Database("./exdb.db3")

process.on("beforeExit", () => {
    self.postMessage({
        status: WorkerStatus.Stopping
    })
    db.close()
    self.postMessage({
        status: WorkerStatus.Dead
    })
    process.exit()
})
