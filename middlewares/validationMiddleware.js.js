const { validationResult } = require('express-validator');

// 요청 데이터 검증 미들웨어
const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req); // 요청 객체에서 검증 결과 확인
  if (!errors.isEmpty()) {
    // 에러가 있으면
    return res.status(400).json({ errors: errors.array() }); // 400 상태와 함께 에러 목록 반환
  }
  next(); // 에러가 없으면 다음 미들웨어로 이동
};

module.exports = validationMiddleware;
