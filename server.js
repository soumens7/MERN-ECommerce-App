const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB before defining routes
const URI = process.env.MONGODB_URL;
mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB ✅");
    startServer(); // Start the server only after DB connection
  })
  .catch((err) => {
    console.error("MongoDB Connection Error ❌:", err);
    process.exit(1); // Exit if DB connection fails
  });

// Function to start server after DB is connected
function startServer() {
  app.use("/user", require("./routes/userRouter.js"));

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// Base route
app.get("/", (req, res) => {
  res.send("Hello World");
});
