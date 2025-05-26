// controllers/categoryController.js

const Category = require('../models/jobCategory');
const Job = require('../models/jobModel');

// @desc    Create a new category
// @route   POST /categories
exports.createCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  try {
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get all categories (alphabetical order)
// @route   GET /categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get all categories with job counts
// @route   GET /categories/with-counts
exports.getAllCategoriesWithCounts = async (req, res) => {
  try {
    const categories = await Category.find();

    const counts = await Job.aggregate([
      { $group: { _id: "$category", total: { $sum: 1 } } }
    ]);

    const countMap = {};
    counts.forEach(c => {
      countMap[c._id] = c.total;
    });

    const result = categories.map(cat => ({
      _id: cat._id,
      name: cat.name,
      createdAt: cat.createdAt,
      totalPosts: countMap[cat.name] || 0
    }));

    res.json(result);
  } catch (err) {
    console.error("Error loading categories:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Update a category
// @route   PUT /categories/:id
exports.updateCategory = async (req, res) => {
  const { name } = req.body;

  try {
    await Category.findByIdAndUpdate(req.params.id, { name });
    res.json({ message: "Category updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update category", error: err.message });
  }
};

// @desc    Delete a category
// @route   DELETE /categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete category", error: err.message });
  }
};

// @desc    Get public categories with job counts
// @route   GET /public/categories
exports.getPublicCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const count = await Job.countDocuments({ category: cat.name });
        return {
          _id: cat._id,
          name: cat.name,
          count,
        };
      })
    );

    res.json(categoriesWithCounts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load categories', error: err.message });
  }
};
