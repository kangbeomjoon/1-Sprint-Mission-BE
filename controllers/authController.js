const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 회원가입
exports.signUp = async (req, res, next) => {
  const { email, password, nickname } = req.body; // 이메일, 비밀번호, 닉네임
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // 비밀번호 해시화하는 로직 (bcrypts는 패키지임 설치필요)
    const user = await prisma.user.create({
      data: {
        email, // 가입하는 이메일
        nickname, // 가입하는 닉네임
        password: hashedPassword, // 사용자는 비밀번호를 입력해서 가입했지만 => 데이터베이스에는 해시화 되어 저장되게 변환 (왜? 해시화 안하면 데이터베이스 유출되면 내 비밀번호는 그대로 털림)
      },
    });

    // JWT 토큰 발급
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    }); // 유효기간 1시간 토큰 생성

    // accessToken과 nickname 반환
    res.status(201).json({ accessToken: token, nickname: user.nickname }); // 생성된 토큰과 닉네임 반환
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};

// 로그인
exports.signIn = async (req, res, next) => {
  const { email, password } = req.body; // 이메일과 비밀번호 가져오기
  try {
    const user = await prisma.user.findUnique({ where: { email } }); // 이메일로 사용자 검색
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' }); // 사용자 없거나 비밀번호 틀릴 경우 에러 메시지 반환
    }

    // JWT 토큰 발급
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    }); // 유효기간 1시간 토큰 생성

    // accessToken과 nickname 반환
    res.status(200).json({ accessToken: token, nickname: user.nickname }); // 생성된 토큰과 닉네임 반환
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};
