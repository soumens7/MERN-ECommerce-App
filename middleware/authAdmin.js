const Users = require("../models/userModel");

const authAdmin = async (req, res, next) => {
  try {
    // Get user information by ID
    const user = await Users.findOne({
      _id: req.user.id,
    }); // Find user by ID in the database
    if (user.role === 0)
      return res.status(400).json({ msg: "Admin resources access denied." }); // If user is not an admin, return an error

    next(); // If user is an admin, call the next middleware
  } catch (err) {
    return res.status(500).json({ msg: err.message }); // Handle errors
  }
};

module.exports = authAdmin;
