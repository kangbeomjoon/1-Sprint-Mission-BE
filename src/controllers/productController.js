const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 상품 등록
exports.createProduct = async (req, res, next) => {
  const { name, description, price, tags } = req.body; // 상품 이름, 설명, 가격, 태그 가져오기
  const images = req.body.images || []; // 이미지 배열 (이미지가 없으면 빈 배열 설정)
  console.log('사용자 정보:', req.user); // 사용자 정보 확인

  try {
    // Prisma로 새로운 상품 생성
    const product = await prisma.product.create({
      data: {
        name, // 상품 이름
        description, // 상품에 대한 설명
        price: parseInt(price, 10), // 가격을 정수로 변환
        tags, // 상품 태그들
        image: images, // 이미지 배열 추가 ( 여기서 image: images가 뭘까요? 프론트엔드에서 images 필드명으로 데이터를 보내주면 images로 들어온 데이터를 백엔드에선 image 필드에 저장한다)
        userId: req.user.id, // 현재 사용자 ID로 설정 (누가 이 상품을 등록했는지를 같이 저장해야돼서))
      },
    });
    res.status(201).json(product); // 생성된 상품을 응답으로 반환
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};

// 상품 목록 조회
exports.getProducts = async (req, res, next) => {
  const {
    page = 1,
    pageSize = 10,
    orderBy = 'recent',
    keyword = '',
  } = req.query; // 페이지, 페이지 크기, 정렬 기준, 키워드 가져오기

  // 정렬 기준 설정
  let sortBy = {};
  if (orderBy === 'recent') {
    sortBy = { createdAt: 'desc' }; // 최신순
  } else if (orderBy === 'favorite') {
    sortBy = { likes: { _count: 'desc' } }; // 좋아요 많은 순
  }

  try {
    // Prisma로 상품 목록 조회
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } }, // 이름에 키워드 포함 여부
          { description: { contains: keyword, mode: 'insensitive' } }, // 설명에 키워드 포함 여부
        ],
      },
      skip: (page - 1) * pageSize, // 페이지 계산
      take: parseInt(pageSize, 10), // 페이지 크기 제한
      orderBy: sortBy, // 정렬 기준
      include: {
        likes: true, // 좋아요 정보 포함
        comments: true, // 댓글 정보 포함
      },
    });

    // 총 상품 수 조회
    const totalCount = await prisma.product.count({
      where: {
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } },
        ],
      },
    });

    res.status(200).json({ totalCount, list: products }); // 총 개수와 상품 목록을 응답으로 반환
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};

// 특정 상품 조회
exports.getProductById = async (req, res, next) => {
  const { productId } = req.params; // URL에서 상품 ID 가져오기 (url에 상품 ID가 같이 나옴 (이건 공식). 특정 상품에 대한 조회이기때문에 어떤 상품을 가져올려면 가져오고 싶은 상품에 대한 고유 ID가 필요)

  try {
    // Prisma로 특정 상품 조회
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
      include: {
        likes: true, // 좋아요 정보 포함
        comments: true, // 댓글 정보 포함
      },
    });
    if (!product) {
      return res.status(404).json({ error: '해당 상품을 찾을 수 없습니다.' }); // 상품이 없을 경우 에러 메시지 반환
    }

    const isFavorite = product.likes.some(
      (like) => like.userId === req.user.id
    ); // 현재 사용자가 좋아요 눌렀는지 확인
    res.status(200).json({ ...product, isFavorite }); // 상품 정보와 좋아요 여부 응답
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};

// 상품 수정
exports.updateProduct = async (req, res, next) => {
  const { productId } = req.params; // URL에서 상품 ID 가져오기 (url에 상품 ID가 같이 나옴 (이건 공식). 특정 상품을 수정하고싶은거여서 어떤 상품을 수정하고싶은지 지정해야됨. 즉 수정하려는 상품의 고유 ID를 가져와야됨)
  const { name, description, price, tags } = req.body; // 수정할 상품 정보 가져오기 (상품등록할때 입력했던 상품 이름, 상품 설명, 가격, 태그들 )
  const images = req.body.images || []; // 이미지 배열 (이미지가 없으면 빈 배열 설정)

  try {
    // Prisma로 상품 업데이트
    const product = await prisma.product.update({
      where: { id: parseInt(productId) },
      data: {
        name, // 상품 이름
        description, // 상품 설명
        price: parseInt(price, 10), // 가격을 정수로 변환
        tags, // 상품 태그들
        image: images, // 이미지 배열 추가 ( 여기서 image: images가 뭘까요? 프론트엔드에서 images 필드명으로 데이터를 보내주면 images로 들어온 데이터를 백엔드에선 image 필드에 저장한다)
      },
    });
    res.status(200).json(product); // 수정된 상품을 응답으로 반환
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};

// 상품 삭제
exports.deleteProduct = async (req, res, next) => {
  const { productId } = req.params; // URL에서 상품 ID 가져오기

  try {
    // Prisma로 상품 삭제
    await prisma.product.delete({
      where: { id: parseInt(productId) },
    });
    res.status(200).json({ id: productId }); // 삭제된 상품 ID 응답으로 반환
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};
