const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ msg: "No files were uploaded" });
  }
  res.json({ msg: "File uploaded successfully" });
});

module.exports = router;
