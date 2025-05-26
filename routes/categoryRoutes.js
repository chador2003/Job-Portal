const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// 🔐 Protected route for creating category
router.post('/', protect, isAdmin, categoryController.createCategory);

// ✅ Public route (no auth) to fetch categories for dropdown
router.get('/', categoryController.getAllCategories);
router.get('/public', categoryController.getPublicCategories);

// 🔐 Optional admin route to show categories with job counts
router.get('/with-counts', protect, isAdmin, categoryController.getAllCategoriesWithCounts);

// 🔐 Update/Delete routes
router.put('/:id', protect, isAdmin, categoryController.updateCategory);
router.delete('/:id', protect, isAdmin, categoryController.deleteCategory);

module.exports = router;
