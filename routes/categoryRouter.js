const router = require("express").Router();
const categoryControl = require("../controllers/categoryControl");
const auth = require("../middleware/auth"); // Import auth middleware
const authAdmin = require("../middleware/authAdmin"); // Import authAdmin middleware

router.route("/category").get(categoryControl.getCategories);
router.route("/category").post(auth, authAdmin, categoryControl.createCategory);

router
  .route("/category/:id")
  .delete(auth, authAdmin, categoryControl.deleteCategory);
router
  .route("/category/:id")
  .put(auth, authAdmin, categoryControl.updateCategory);

module.exports = router;
