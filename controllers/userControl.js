const Users = require("../models/userModel");
//const bcrypt = require("bcrypt");

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

      //const salt = await bcrypt.genSalt(10);
      //const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new Users({ name, email, password});
      // save mongodb
      await newUser.save();

      res.json({ msg: "Register Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = userControl;
