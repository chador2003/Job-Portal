const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware')
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', authMiddleware.protect, authController.getMe); // ✅ Required
module.exports = router; // ✅ single router export
