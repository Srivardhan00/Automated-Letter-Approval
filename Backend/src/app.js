import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import letterRouter from "./routes/letter.route.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000", // specify the frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"], // specify allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // specify allowed headers
  credentials: true, // allow cookies and other credentials
};
app.use(cors(corsOptions));

// Routes
app.use("/user", userRouter);
app.use("/letter", letterRouter);

export { app };
