const userControl = require("../controllers/userControl");
const auth = require("../middleware/auth");

// Initialize express router
const router = require("express").Router();

// Set default API response
router.get("/", (req, res) => {
  res.send("Welcome");
});

// Register
router.post("/register", userControl.register);
router.post("/login", userControl.login);
router.get("/logout", userControl.logout);
router.post("/refresh_token", userControl.refreshToken);
router.get("/infor", auth, userControl.getUser);

module.exports = router;
