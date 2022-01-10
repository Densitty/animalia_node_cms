const Category = require("../models/Category");
const Post = require("../models/Post");

exports.displayCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.render("admin/categories/", {
      categories: categories.map((cat) => cat.toJSON()),
    });
  } catch (err) {}
};

exports.createCategory = async (req, res) => {
  try {
    await Category.create({
      name: req.body.name,
    });
    res.redirect("/admin/categories");
  } catch (err) {
    if (err.name === "MongoServerError" && err.code === 11000) {
      // Duplicate username
      console.log("Name already exists.");
      res.status(422).json({
        status: false,
        message: "Category already exists!",
      });
    } else {
      console.log(err);
    }
  }
};

exports.getEditCategory = async (req, res) => {
  try {
    const category = await Category.findById({
      _id: req.params.id,
    });
    res.render("admin/categories/edit", { category: category.toJSON() });
  } catch (err) {
    console.log(err);
  }
};

exports.publishEditedCategory = async (req, res) => {
  try {
    await Category.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      { name: req.body.name },
      { new: true, runValidators: true }
    );
    res.redirect("/admin/categories");
  } catch (err) {
    console.log(err);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete({ _id: req.params.id });
    res.redirect("/admin/categories");
  } catch (err) {
    console.log(err);
  }
};
