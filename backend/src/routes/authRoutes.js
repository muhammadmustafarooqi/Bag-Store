const express = require('express');
const router = express.Router();
const { register, login, logout, refreshToken, getMe } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.get('/me', authMiddleware, getMe);

module.exports = router;
