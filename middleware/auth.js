const jwt = require("jsonwebtoken"); // Importing JWT library

const auth = (req, res, next) => {
  try {
    // Get token from the request header
    const token = req.header("Authorization");

    // If token is missing, return an error
    if (!token) return res.status(400).json({ msg: "Invalid Authentication" });

    // Verify the token using JWT and secret key
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(400).json({ msg: "Invalid Authentication" });

      // Attach the decoded user data to the request object
      req.user = user;

      // Call next() to proceed to the next middleware or route
      next();
    });
  } catch (err) {
    // Handle unexpected errors
    return res.status(500).json({ msg: err.message });
  }
};

// Export the middleware
module.exports = auth;
