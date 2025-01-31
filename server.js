const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Server is running....");
});

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/user", require("./routes/userRouter.js"));

// connect to MongoDB

const URI = process.env.MONGODB_URL;
mongoose
  .connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {});
