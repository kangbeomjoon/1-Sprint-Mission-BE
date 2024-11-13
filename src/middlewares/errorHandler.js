// 에러 핸들링 미들웨어
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // 응답 상태가 200일 경우 500으로 설정, 아니면 기존 상태 코드 유지

  res.status(statusCode); // 에러 상태 코드로 응답 설정

  res.json({
    message: err.message, // 에러 메시지
    stack: err.stack, // 에러 발생위치 - 개발용
  });
};

module.exports = errorHandler;
