import express from "express";
import cors from "cors";
// Create an instance of an Express app
const app = express();
const port = 6000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.get("/test-method", async (req, res) => {
  try {
    res.status(200).send("hello");
  } catch (error) {
    res.status(500).send("Error executing test method:", error);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
