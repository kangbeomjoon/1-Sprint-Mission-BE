const express = require('express');
const {
  getCurrentUser,
  updateUser,
  updatePassword,
  getUserProducts,
  getUserFavorites,
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/me', authMiddleware, getCurrentUser);
router.patch('/me', authMiddleware, updateUser);
router.patch('/me/password', authMiddleware, updatePassword);
router.get('/me/products', authMiddleware, getUserProducts);
router.get('/me/favorites', authMiddleware, getUserFavorites);

module.exports = router;

// 맨 뒤에 나오는 함수 이름은 userController 파일에서 가져온 함수

// 중간에 나오는 authMiddleware => 로그인한 사용자만 가능 (authMiddleware를 넣어놨기 때문. authMiddleware에 토큰을 사용하여 로그인한 사용자만 접근할 수 있도록 해놨기 때문)
