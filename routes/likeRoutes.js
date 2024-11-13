const express = require('express');
const {
  likeProduct,
  unlikeProduct,
  likeArticle,
  unlikeArticle,
} = require('../controllers/likeController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// 상품 좋아요 - 로그인한 사용자만 가능 (authMiddleware를 넣어놨기 때문. authMiddleware에 토큰을 사용하여 로그인한 사용자만 접근할 수 있도록 해놨기 때문)
router.post('/products/:productId/like', authMiddleware, likeProduct);

// 상품 좋아요 취소 - 로그인한 사용자만 가능 (authMiddleware를 넣어놨기 때문. authMiddleware에 토큰을 사용하여 로그인한 사용자만 접근할 수 있도록 해놨기 때문)
router.delete('/products/:productId/like', authMiddleware, unlikeProduct);

// 게시글 좋아요 - 로그인한 사용자만 가능 (authMiddleware를 넣어놨기 때문. authMiddleware에 토큰을 사용하여 로그인한 사용자만 접근할 수 있도록 해놨기 때문)
router.post('/articles/:articleId/like', authMiddleware, likeArticle);

// 게시글 좋아요 취소 - 로그인한 사용자만 가능 (authMiddleware를 넣어놨기 때문. authMiddleware에 토큰을 사용하여 로그인한 사용자만 접근할 수 있도록 해놨기 때문)
router.delete('/articles/:articleId/like', authMiddleware, unlikeArticle);

module.exports = router;

// 맨 뒤에 나오는 함수 이름은 likeController 파일에서 가져온 함수
