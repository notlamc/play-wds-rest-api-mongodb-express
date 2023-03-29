import dotenv from "dotenv";

import express from "express";

import mongoose from "mongoose";

import subscribersRoutes from "./routes/subscribers";

dotenv.config();

const app = express();

mongoose.connect(
  `mongodb+srv://${process.env["MONGODB_USERNAME"]}:${process.env["MONGODB_PASSWORD"]}@${process.env["MONGODB_HOSTNAME"]}/${process.env["MONGODB_DATABASE_NAME"]}?retryWrites=true&w=majority`
);

const db = mongoose.connection;

db.on("error", (err) => console.error(`Error: ${err}`));

db.once("open", () => console.log("Connected to database."));

app.use(express.json());

app.use("/subscribers", subscribersRoutes);

app.listen(process.env["LISTEN_PORT"], () =>
  console.log(
    `Server listening at http://localhost:${process.env["LISTEN_PORT"]}`
  )
);
