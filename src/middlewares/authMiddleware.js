const jwt = require('jsonwebtoken');

// JWT 인증 미들웨어 => 토큰을 사용하여 로그인한 사용자만 접근할 수 있도록 하기 위해서 만듦 => routes 파일들에서 정말 많이 쓰일 예정
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // 헤더에서 토큰 가져오기 (Bearer [token] 형태) (postman에서 테스트할때 이게 필요함)

  if (!token) return res.status(401).json({ error: '접근이 거부되었습니다.' }); // 토큰이 없으면 401 상태로 접근 거부 메시지 반환

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET); // 토큰 검증
    req.user = { id: verified.userId }; // 검증된 userId를 req.user에 저장
    next(); // 인증이 성공하면 다음 미들웨어로 이동
  } catch (error) {
    res.status(401).json({ error: '유효한 토큰이 만료되었습니다.' }); // 토큰이 유효하지 않거나 만료되었을 때 에러 메시지 반환
  }
};

module.exports = authMiddleware;
