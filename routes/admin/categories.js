const express = require("express");
const {
  getEditCategory,
  publishEditedCategory,
  deleteCategory,
  createCategory,
  displayCategories,
} = require("../../controllers/categoriesController");
const router = express.Router();

router.all("/*", (req, res, next) => {
  req.app.locals.layout = "admin";
  next();
});

router.get("/", displayCategories);

router.post("/create", createCategory);

router.get("/edit/:id", getEditCategory);

router.patch("/edit/:id", publishEditedCategory);

router.delete("/:id", deleteCategory);

module.exports = router;
