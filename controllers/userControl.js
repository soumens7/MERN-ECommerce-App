const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userControl = {
  register: async (req, res) => {
    try {
      //console.log("Request Body:", req.body); // Debugging line
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ msg: "Please fill in all fields." });
      }
      const user = await Users.findOne({ email });
      if (user) return res.status(400).json({ msg: "Email already exists." });

      if (password.length < 6) {
        return res
          .status(400)
          .json({ msg: "Password must be at least 6 characters long." });
      }

      const salt = await bcrypt.genSalt(10);
      // Password encryption
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new Users({ name, email, password: hashedPassword });
      // save mongodb
      await newUser.save();

      // create jsonwebtoken to authentication
      const accessToken = createAccessToken({ id: newUser._id });
      const refreshToken = createAccessToken({ id: newUser._id });

      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: "/user/refresh_token",
      });

      res.json({ accessToken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  refreshToken: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;

      if (!rf_token)
        return res.status(400).json({ msg: "Please login or register" });
      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(400).json({ msg: "Please login or register" });
        const accessToken = createAccessToken({ id: user.id });
        res.json({ accessToken });
      });

      res.json({ rf_token });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });

      if (!user) return res.status(400).json({ msg: "User does not exist." });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Incorrect password." });

      const accessToken = createAccessToken({ id: user._id });
      const refresh_token = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/user/refresh_token",
      });

      res.json({accessToken});
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      return res.json({ msg: "Logged out!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id
      ).select("-password");
      if (!user) return res.status(400).json({ msg: "User does not exist." });
      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};
const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = userControl;
