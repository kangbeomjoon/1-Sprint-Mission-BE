const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// 상품 등록 - 로그인한 사용자만 가능 (authMiddleware를 넣어놨기 때문. authMiddleware에 토큰을 사용하여 로그인한 사용자만 접근할 수 있도록 해놨기 때문)
router.post('/', authMiddleware, createProduct);

// 모든 상품 목록 조회
router.get('/', getProducts);

// 특정 상품 조회
router.get('/:productId', getProductById);

// 상품 수정 - 로그인한 사용자만 가능 (authMiddleware를 넣어놨기 때문. authMiddleware에 토큰을 사용하여 로그인한 사용자만 접근할 수 있도록 해놨기 때문)
router.patch('/:productId', authMiddleware, updateProduct);

// 상품 삭제 - 로그인한 사용자만 가능 (authMiddleware를 넣어놨기 때문. authMiddleware에 토큰을 사용하여 로그인한 사용자만 접근할 수 있도록 해놨기 때문)
router.delete('/:productId', authMiddleware, deleteProduct);

module.exports = router;

// 맨 뒤에 나오는 함수 이름은 productController 파일에서 가져온 함수
