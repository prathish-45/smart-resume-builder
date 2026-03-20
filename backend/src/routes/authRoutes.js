const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
    forgotUserPassword,
    resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotUserPassword);
router.put('/reset-password/:resettoken', resetPassword);
router.get('/me', protect, getMe);

module.exports = router;
