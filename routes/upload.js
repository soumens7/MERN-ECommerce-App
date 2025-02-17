const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), (req, res) => {
  res.json({ msg: "File uploaded successfully" });
});

// ✅ Export the router
module.exports = router;
