import "dotenv/config";
import { app } from "./app.js";
import connectDB from "./db/connectDB.js";

connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.log("Application Error".err);
    });
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on PORT : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB connection error", err);
  });
