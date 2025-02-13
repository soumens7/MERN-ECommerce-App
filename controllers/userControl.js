const Users = require("../models/userModel"); // Importing the User model
const bcrypt = require("bcrypt"); // Importing bcrypt for password hashing
const jwt = require("jsonwebtoken"); // Importing JSON Web Token for authentication

const userControl = {
  // Controller function for user registration
  register: async (req, res) => {
    try {
      // Destructuring name, email, and password from request body
      const { name, email, password } = req.body;

      // Check if all required fields are provided
      if (!name || !email || !password) {
        return res.status(400).json({ msg: "Please fill in all fields." });
      }

      // Check if the user already exists in the database
      const user = await Users.findOne({ email });
      if (user) return res.status(400).json({ msg: "Email already exists." });

      // Ensure password length is at least 6 characters
      if (password.length < 6) {
        return res.status(400).json({ msg: "Password must be at least 6 characters long." });
      }

      // Generate salt and hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user instance
      const newUser = new Users({ name, email, password: hashedPassword });

      // Save new user to the database
      await newUser.save();

      // Create JWT access and refresh tokens
      const accessToken = createAccessToken({ id: newUser._id });
      const refreshToken = createRefreshToken({ id: newUser._id });

      // Store refresh token in HTTP-only cookie for security
      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: "/user/refresh_token",
      });

      // Send access token in response
      res.json({ accessToken });
    } catch (err) {
      return res.status(500).json({ msg: err.message }); // Handle errors
    }
  },

  // Controller function to refresh the access token
  refreshToken: async (req, res) => {
    try {
      // Retrieve refresh token from cookies
      const rf_token = req.cookies.refreshtoken;

      // Check if refresh token exists
      if (!rf_token) return res.status(400).json({ msg: "Please login or register" });

      // Verify the refresh token
      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(400).json({ msg: "Please login or register" });

        // Generate new access token
        const accessToken = createAccessToken({ id: user.id });
        res.json({ accessToken });
      });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // Controller function for user login
  login: async (req, res) => {
    try {
      // Extract email and password from request body
      const { email, password } = req.body;

      // Find user by email
      const user = await Users.findOne({ email });

      // Check if user exists
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      // Compare provided password with stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Incorrect password." });

      // Generate JWT access and refresh tokens
      const accessToken = createAccessToken({ id: user._id });
      const refreshToken = createRefreshToken({ id: user._id });

      // Store refresh token in HTTP-only cookie
      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: "/user/refresh_token",
      });

      // Send access token in response
      res.json({ accessToken });
    } catch (err) {
      return res.status(500).json({ msg: err.message }); // Handle errors
    }
  },

  // Controller function for user logout
  logout: async (req, res) => {
    try {
      // Clear the refresh token from cookies
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      return res.json({ msg: "Logged out!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message }); // Handle errors
    }
  },

  // Controller function to fetch user data
  getUser: async (req, res) => {
    try {
      // Find user by ID and exclude the password field
      const user = await Users.findById(req.user.id).select("-password");
      
      // Check if user exists
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      // Send user data in response
      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message }); // Handle errors
    }
  },
};

// Function to create JWT access token
const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d", // Access token expires in 1 day
  });
};

// Function to create JWT refresh token
const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d", // Refresh token expires in 7 days
  });
};

// Export user controller
module.exports = userControl;
