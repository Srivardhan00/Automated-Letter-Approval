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
  origin: "http://localhost:5173", // specify the frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"], // specify allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // specify allowed headers
  credentials: true, // allow cookies and other credentials
};
app.use(cors(corsOptions));

// Routes
app.use("/user", userRouter);
app.use("/letter", letterRouter);

import { ApiError } from "./utils/ApiError.js";

// Error-handling middleware
app.use((err, req, res, next) => {
  // If the error is an instance of ApiError, use its properties to build the response
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
      data: err.data,
    });
  }
  // For unexpected errors, use a generic error response
  return res.status(500).json({
    success: false,
    message: "Internal Server khdsbkfbksk",
  });
});

export { app };
