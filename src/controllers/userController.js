const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

// 현재 유저 정보 조회
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }, // 현재 로그인한 사용자 ID로 유저 정보 찾기
      select: {
        id: true, // 유저 ID
        nickname: true, // 닉네임
        image: true, // 프로필 이미지
        createdAt: true, // 가입한 날짜
        updatedAt: true, // 마지막 수정 일시
      },
    });
    res.status(200).json(user); // 유저 정보 응답으로 반환
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};

// 유저 정보 업데이트
exports.updateUser = async (req, res, next) => {
  const { image } = req.body; // 수정할 이미지 가져오기
  try {
    const user = await prisma.user.update({
      where: { id: req.user.id }, // 현재 로그인한 사용자 ID로 유저 정보 찾기
      data: { image }, // 새로운 이미지 데이터로 수정
      select: {
        id: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.status(200).json(user); // 업데이트된 유저 정보 응답으로 반환
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};

// 비밀번호 변경
exports.updatePassword = async (req, res, next) => {
  const { currentPassword, password, passwordConfirmation } = req.body; // 현재 비밀번호, 새로운 비밀번호, 비밀번호 확인 가져오기

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } }); // 현재 로그인한 사용자 ID로 유저 정보 찾기
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return res
        .status(400)
        .json({ error: '현재 비밀번호가 올바르지 않습니다.' }); // 현재 비밀번호가 틀렸을 때 에러 반환
    }

    if (password !== passwordConfirmation) {
      return res.status(400).json({ error: '비밀번호가 일치하지 않습니다.' }); // 비밀번호와 확인이 일치하지 않을 때 에러 반환
    }

    const hashedPassword = await bcrypt.hash(password, 10); // 새로운 비밀번호 해시화
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }, // 해시된 비밀번호로 업데이트
      select: {
        id: true,
        nickname: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json(updatedUser); // 업데이트된 유저 정보 응답으로 반환
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};

// 유저의 상품 목록 조회
exports.getUserProducts = async (req, res, next) => {
  const { page = 1, pageSize = 10, keyword = '' } = req.query; // 페이지, 페이지 크기, 검색 키워드 가져오기
  try {
    const products = await prisma.product.findMany({
      where: {
        userId: req.user.id, // 현재 사용자 ID로 상품 찾기
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } }, // 이름에 키워드 포함 여부
          { description: { contains: keyword, mode: 'insensitive' } }, // 설명에 키워드 포함 여부
        ],
      },
      skip: (page - 1) * pageSize, // 페이지 계산
      take: parseInt(pageSize, 10), // 페이지 크기 제한
      include: {
        likes: true, // 좋아요 정보 포함
      },
    });

    const totalCount = await prisma.product.count({
      where: {
        userId: req.user.id,
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } },
        ],
      },
    });

    res.status(200).json({ totalCount, list: products }); // 총 개수와 상품 목록 응답으로 반환
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};

// 유저의 좋아요 상품 목록 조회
exports.getUserFavorites = async (req, res, next) => {
  const { page = 1, pageSize = 10, keyword = '' } = req.query; // 페이지, 페이지 크기, 검색 키워드 가져오기
  try {
    const products = await prisma.product.findMany({
      where: {
        likes: {
          some: {
            userId: req.user.id, // 현재 사용자가 좋아요한 상품 찾기
          },
        },
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } }, // 이름에 키워드 포함 여부
          { description: { contains: keyword, mode: 'insensitive' } }, // 설명에 키워드 포함 여부
        ],
      },
      skip: (page - 1) * pageSize, // 페이지 계산
      take: parseInt(pageSize, 10), // 페이지 크기 제한
      include: {
        likes: true, // 좋아요 정보 포함
      },
    });

    const totalCount = await prisma.product.count({
      where: {
        likes: {
          some: {
            userId: req.user.id,
          },
        },
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } },
        ],
      },
    });

    res.status(200).json({ totalCount, list: products }); // 총 개수와 좋아요한 상품 목록 응답으로 반환
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};
