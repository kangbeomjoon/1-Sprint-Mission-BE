const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 게시글 생성
exports.createArticle = async (req, res, next) => {
  const { title, content, tags } = req.body; // 입력된 제목, 내용, 태그 가져오기
  const imagePaths = req.files.map((file) => `/uploads/${file.filename}`); // 업로드된 이미지 파일 경로 배열로 저장

  try {
    // Prisma로 새로운 게시글 생성
    const article = await prisma.article.create({
      data: {
        title, // 제목
        content, // 내용
        tags, // 태그들
        image: imagePaths, // 이미지들
        userId: req.user.id, // 현재 사용자 ID로 userId 설정
      },
    });
    res.status(201).json(article); // 생성된 게시글을 응답으로 반환
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};

// 게시글 목록 조회
exports.getArticles = async (req, res, next) => {
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
  } else if (orderBy === 'like') {
    sortBy = { likes: { _count: 'desc' } }; // 좋아요 많은 순
  }

  try {
    // Prisma로 게시글 목록 조회
    const articles = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } }, // 제목에 키워드 포함 여부
          { content: { contains: keyword, mode: 'insensitive' } }, // 내용에 키워드 포함 여부
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
    res.status(200).json(articles); // 조회된 게시글 목록을 응답으로 반환
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};

// 특정 게시글 조회
exports.getArticleById = async (req, res, next) => {
  const { id } = req.params; // 경로 매개변수에서 게시글 ID 가져오기 (특정 게시글 조회라서 1번 게시글을 조회하고싶다, 2번 게시글을 조회하고싶다)

  try {
    // Prisma로 ID에 맞는 게시글 찾기
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) }, // ID를 정수로 변환
      include: {
        likes: true, // 좋아요 정보 포함
        comments: true, // 댓글 정보 포함
      },
    });
    if (!article)
      // 게시글이 없을 때
      return res.status(404).json({ error: '해당 게시글을 찾을 수 없습니다.' });

    const isLiked = article.likes.some((like) => like.userId === req.user.id); // 현재 사용자가 좋아요 눌렀는지 확인

    res.status(200).json({ ...article, isLiked }); // 게시글과 좋아요 여부 응답
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};

// 게시글 수정
exports.updateArticle = async (req, res, next) => {
  const { id } = req.params; // 경로 매개변수에서 게시글 ID 가져오기 (어떤 게시글을 수정하려면 수정하고싶은 게시글에 대한 고유 ID를 알아야됨 => 1번 게시글을 수정하고싶다 그러면 게시글 ID 1번을 가져오듯이)
  const { title, content, tags } = req.body; // 수정할 제목, 내용, 태그 가져오기
  const imagePaths = req.files.map((file) => `/uploads/${file.filename}`); // 업로드된 이미지 파일 경로 배열로 저장

  try {
    // Prisma로 게시글 수정
    const article = await prisma.article.update({
      where: { id: parseInt(id) }, // ID를 정수로 변환하여 조건으로 사용
      data: { title, content, tags, image: imagePaths }, // 수정할 데이터 설정
    });
    res.status(200).json(article); // 수정된 게시글을 응답으로 반환
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};

// 게시글 삭제
exports.deleteArticle = async (req, res, next) => {
  const { id } = req.params; // 경로 매개변수에서 게시글 ID 가져오기 (게시글을 삭제하려면 그냥 삭제 못하고 삭제하고 싶은 게시글ID를 알아야됨,, 1번 게시글을 삭제하고싶다)

  try {
    // Prisma로 게시글 삭제
    await prisma.article.delete({
      where: { id: parseInt(id) }, // ID를 정수로 변환하여 조건으로 사용
    });
    res.status(200).json({ message: '게시글이 성공적으로 삭제되었습니다.' }); // 성공 메시지 응답
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};
