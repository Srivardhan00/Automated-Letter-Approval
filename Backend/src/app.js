import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  urlencoded({
    extended: true,
  })
);

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.route.js";

app.use("/user", userRouter);

import letterRouter from "./routes/letter.route.js";
app.use("/letter", letterRouter);

export { app };
