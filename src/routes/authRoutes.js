const express = require('express');
const { signUp, signIn } = require('../controllers/authController');
const validationMiddleware = require('../middlewares/validationMiddleware');
const router = express.Router();

router.post('/signUp', validationMiddleware, signUp);

router.post('/signIn', validationMiddleware, signIn);

module.exports = router;

// 맨 뒤에 나오는 함수 이름은 authController 파일에서 가져온 함수
