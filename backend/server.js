import dotenv from 'dotenv';
import { connectDb } from "./src/DB/Db.js"
import { app } from "./src/app.js"

dotenv.config()

const port = process.env.PORT
const dbName = "Mood-Mingle"

//Uncaught exception Handling
process.on("uncaughtException", (err) => {
    console.log(`error:${err.message}`)
    console.log(`Shutting down the server due to Unhandled Promise Rejection`)
    process.exit(1)
})

connectDb(dbName)

const server = app.listen(port, () => {
    console.log(`your server is running on port ${port} `);
});


//Unhandled Promise rejection
process.on("unhandledRejection", (err) => {
    console.log(`error:${err.message}`)
    console.log(`Shutting down the server due to Unhandled Promise Rejection`)

    server.close(() => {
        process.exit(1)
    })
})