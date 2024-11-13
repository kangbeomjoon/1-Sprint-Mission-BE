const express = require('express');
const {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} = require('../controllers/articleController');
const upload = require('../utils/multer');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// 게시글 생성 - 로그인한 사용자만 가능 (authMiddleware를 넣어놨기 때문. authMiddleware에 토큰을 사용하여 로그인한 사용자만 접근할 수 있도록 해놨기 때문), 이미지 최대 3개
router.post('/', authMiddleware, upload.array('images', 3), createArticle);

// 모든 게시글 목록 조회
router.get('/', getArticles);

// 특정 게시글 조회
router.get('/:id', getArticleById);

// 게시글 수정 - 로그인한 사용자만 가능 (authMiddleware를 넣어놨기 때문. authMiddleware에 토큰을 사용하여 로그인한 사용자만 접근할 수 있도록 해놨기 때문)
router.patch('/:id', authMiddleware, upload.array('images', 3), updateArticle);

// 게시글 삭제 - 로그인한 사용자만 가능 (authMiddleware를 넣어놨기 때문. authMiddleware에 토큰을 사용하여 로그인한 사용자만 접근할 수 있도록 해놨기 때문)
router.delete('/:id', authMiddleware, deleteArticle);

module.exports = router;

// 맨 뒤에 나오는 함수 이름은 articleController 파일에서 가져온 함수
