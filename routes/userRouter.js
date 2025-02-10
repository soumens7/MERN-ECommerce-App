const userControl = require("../controllers/userControl");

// Initialize express router
const router = require("express").Router();

// Set default API response
router.get("/", (req, res) => {
  res.send("Welcome");
});

// Register
router.post("/register", userControl.register);
router.post("/refresh_token", userControl.refreshToken);

module.exports = router;
