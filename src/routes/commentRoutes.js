const express = require('express');
const {
  createProductComment,
  createArticleComment,
  updateProductComment,
  updateArticleComment,
  deleteProductComment,
  deleteArticleComment,
  getProductComments,
  getArticleComments,
} = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// 상품에 대한 댓글 생성 - 로그인한 사용자만 가능 (authMiddleware를 넣어놨기 때문. authMiddleware에 토큰을 사용하여 로그인한 사용자만 접근할 수 있도록 해놨기 때문)
router.post(
  '/products/:productId/comments',
  authMiddleware,
  createProductComment
);

// 게시글에 대한 댓글 생성 - 로그인한 사용자만 가능 (authMiddleware를 넣어놨기 때문. authMiddleware에 토큰을 사용하여 로그인한 사용자만 접근할 수 있도록 해놨기 때문)
router.post(
  '/articles/:articleId/comments',
  authMiddleware,
  createArticleComment
);

// 상품에 대한 댓글 조회 - 로그인 필요 X (로그인한 사용자만 이용가능하게 하고싶으면 authMiddleware 넣어주면 됨)
router.get('/products/:productId/comments', getProductComments);

// 게시글 댓글 목록 조회 - 로그인한 사용자만 가능 (authMiddleware를 넣어놨기 때문. authMiddleware에 토큰을 사용하여 로그인한 사용자만 접근할 수 있도록 해놨기 때문)
router.get('/articles/:articleId/comments', authMiddleware, getArticleComments);

// 상품 댓글 수정 - 로그인한 사용자만 가능 (authMiddleware를 넣어놨기 때문. authMiddleware에 토큰을 사용하여 로그인한 사용자만 접근할 수 있도록 해놨기 때문)
router.patch(
  '/products/:productId/comments/:id',
  authMiddleware,
  updateProductComment
);

// 게시글 댓글 수정 - 로그인한 사용자만 가능 (authMiddleware를 넣어놨기 때문. authMiddleware에 토큰을 사용하여 로그인한 사용자만 접근할 수 있도록 해놨기 때문)
router.patch(
  '/articles/:articleId/comments/:id',
  authMiddleware,
  updateArticleComment
);

// 상품 댓글 삭제 - 로그인한 사용자만 가능 (authMiddleware를 넣어놨기 때문. authMiddleware에 토큰을 사용하여 로그인한 사용자만 접근할 수 있도록 해놨기 때문)
router.delete(
  '/products/:productId/comments/:id',
  authMiddleware,
  deleteProductComment
);

// 게시글 댓글 삭제 - 로그인한 사용자만 가능 (authMiddleware를 넣어놨기 때문. authMiddleware에 토큰을 사용하여 로그인한 사용자만 접근할 수 있도록 해놨기 때문) + CommentController 파일에서  deleteArticleComment 함수 사용
router.delete(
  '/articles/:articleId/comments/:id',
  authMiddleware,
  deleteArticleComment
);

module.exports = router;

// 맨 뒤에 나오는 함수 이름은 commentController 파일에서 가져온 함수
