const categoryModel = require("../models/categoryModel");
const { create } = require("../models/userModel");
const { Category } = require("@material-ui/icons");
const category = require("../models/categoryModel");

const categoryControl = {
  getCategories: async (req, res) => {
    try {
      const categories = await categoryModel.find();
      res.json(categories);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const category = await Category.findOne({ name });
    
      if (category)
        return res.status(400).json({ msg: "This category already exists." });

      const newCategory = new Category({ name });

      await newCategory.save();
      res.json("Check Admin Success");
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = categoryControl;
