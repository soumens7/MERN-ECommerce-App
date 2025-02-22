const Products = require("../models/productModel");

// Filter, sorting and paginating
class APIfeatures {
  constructor(query, queryString) {
    this.query = query; // Mongoose query object (e.g., Products.find())
    this.queryString = queryString; // Query parameters from request (req.query)
  }

  /**
   * Filters out specified fields (e.g., page, sort, limit) from the query
   * and converts MongoDB query operators (gte, gt, lt, lte, regex)
   * to their proper format.
   */
  filtering() {
    // Clone the query string to avoid modifying the original req.query object
    const queryObj = { ...this.queryString };
    console.log(queryObj); // Debugging: Check what query parameters were received

    // List of fields to exclude from filtering (used for pagination & sorting)
    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]); // Remove them from queryObj

    //console.log(queryObj); // Debugging: Check the modified query object
    // Convert query object into a JSON string
    let queryStr = JSON.stringify(queryObj);
    //console.log(queryObj.queryStr); // Debugging: Check the JSON string

    // Replace certain operators with MongoDB syntax (e.g., gte → $gte)
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );

    // Apply the modified filters to the query
    this.query.find(JSON.parse(queryStr));

    return this; // Return the instance for method chaining
  }

  /**
   * Sorts the query results based on a specified field
   * Example usage: ?sort=price or ?sort=-createdAt (descending)
   */
  sorting() {
    if (this.queryString.sort) {
      // Convert comma-separated values into space-separated string (e.g., "price,-rating")
      const sortBy = this.queryString.sort.split(",").join(" ");
      console.log(sortBy); // Debugging: Check the sorting criteria
      this.query = this.query.sort(sortBy); // Apply sorting to Mongoose query
      console.log(sortBy); // Debugging: Check the sorting criteria
    } else {
      this.query = this.query.sort("-createdAt"); // Default sorting: newest first
    }

    return this;
  }

  /**
   * Implements pagination by skipping and limiting results.
   * Example usage: ?page=2&limit=10
   */
  paginating() {
    const page = this.queryString.page * 1 || 1; // Convert page to a number (default: 1)
    const limit = this.queryString.limit * 1 || 10; // Convert limit to a number (default: 10)
    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    this.query = this.query.skip(skip).limit(limit); // Apply pagination

    return this;
  }
}

const productControl = {
  getProducts: async (req, res) => {
    try {
      console.log(req.query);
      const features = new APIfeatures(Products.find(), req.query)
        .filtering()
        .sorting()
        .paginating();
      const products = await features.query;

      res.json({ result: products.length, products });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createProduct: async (req, res) => {
    try {
      const {
        product_id,
        title,
        price,
        description,
        content,
        images,
        category,
      } = req.body;

      if (!images) return res.status(400).json({ msg: "No image upload" });

      const product = await Products.findOne({ product_id });

      if (product)
        return res.status(400).json({ msg: "This product already exists." });

      const newProduct = new Products({
        product_id,
        title: title.toLowerCase(),
        price,
        description,
        content,
        images,
        category,
      });

      await newProduct.save(); // Save to MongoDB
      res.json({ msg: "Product created successfully!", newProduct });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      await Products.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deleted a product" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { title, price, description, content, images, category } = req.body;
      //if (!images) return res.status(400).json({ msg: "No image upload" });
      await Products.findOneAndUpdate(
        { _id: req.params.id },
        {
          title: title.toLowerCase(),
          price,
          description,
          content,
          images,
          category,
        }
      );
      res.json({ msg: "Updated a product" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = productControl;
