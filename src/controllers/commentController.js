const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 상품에 댓글 추가
exports.createProductComment = async (req, res, next) => {
  const { content } = req.body; // 댓글 내용
  const { productId } = req.params; // 상품 ID (이 값으로 어떤 상품에 대한 댓글인지 구별할 수 있음. 예를 들어 "복숭아" 상품에 달린 댓글인지 확인할 때 필요함, 복숭아 상품은 상품 ID가 몇번으로 저장되는지는 서버에서 자동으로 만들어줌)

  // 댓글 작성자와 상품 ID 확인
  console.log(
    '댓글 작성자 userId:',
    req.user ? req.user.id : 'userId가 없습니다.'
  );
  console.log('등록할 상품 ID:', productId);

  try {
    const comment = await prisma.comment.create({
      data: {
        content, // 댓글 내용
        productId: parseInt(productId), // 상품 ID 설정 (어떤 상품에 대한 댓글인지를 구분해서 저장해야되기 때문)
        userId: req.user.id, // 현재 사용자 ID로 설정
      },
    });

    // 생성된 댓글 확인
    console.log('생성된 댓글:', comment);

    res.status(201).json(comment); // 생성된 댓글 응답으로 반환
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};

// 게시글에 댓글 추가
exports.createArticleComment = async (req, res, next) => {
  const { content } = req.body; // 댓글 내용 가져오기
  const { articleId } = req.params; // 게시글 ID 가져오기 (이 값으로 어떤 게시글에 대한 댓글인지 구별할 수 있음. 예를 들어 "타이슨" 게시글에 달린 댓글인지 확인할 때 필요함)

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        articleId: parseInt(articleId), // 게시글 ID 설정 (어떤 게시글에 대한 댓글인지를 구분해서 저장해야되기 때문)
        userId: req.user.id, // 현재 사용자 ID로 설정
      },
    });
    res.status(201).json(comment); // 생성된 댓글 응답으로 반환
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};

// 상품 댓글 목록 조회
exports.getProductComments = async (req, res, next) => {
  const { productId } = req.params; // 상품 ID 가져오기 (왜? 어떤 상품에 대한 댓글을 가져올지를 알아야되기 때문.. 1번 상품에 대한 댓글목록들을 가져오고싶다)

  console.log('불러올 상품 ID:', productId); // (2번 상품에 대한 댓글들 불러오고싶은데 잘 불러와졌나)

  if (!productId) {
    console.error('상품 ID가 제공되지 않았습니다.');
    return res.status(400).json({ error: '상품 ID가 제공되지 않았습니다.' });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { productId: parseInt(productId) },
      include: { user: true }, // 댓글 작성자 정보 포함
    });

    console.log('불러온 댓글 목록:', comments);

    if (comments.length === 0) {
      return res.status(404).json({ message: '댓글이 없습니다.' });
    }

    res.status(200).json(comments); // 불러온 댓글 목록 응답으로 반환
  } catch (error) {
    console.error('댓글 목록 불러오기 중 오류:', error);
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};

// 게시글 댓글 목록 조회
exports.getArticleComments = async (req, res, next) => {
  const { articleId } = req.params; // 게시글 ID 가져오기 (1번 게시글에 대한 댓글인지 2번 게시글에 대한 댓글인지 구분이 필요해서 몇번 게시물에 대한 댓글을 가져오고싶은지.. 즉 댓글 목록을 가져오고싶은 게시글 ID가 필요)

  try {
    const comments = await prisma.comment.findMany({
      where: { articleId: parseInt(articleId) },
      include: { user: true }, // 댓글 작성자 정보 포함
    });
    res.status(200).json(comments); // 불러온 댓글 목록 응답으로 반환
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};

// 상품 댓글 수정
exports.updateProductComment = async (req, res, next) => {
  const { id } = req.params; // 댓글 ID 가져오기 (댓글을 수정하려면 수정하려는 댓글 고유 ID를 알아야됨 => 1번 댓글을 수정하고싶다 )
  const { content } = req.body; // 수정할 댓글 내용 가져오기

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!comment) {
      return res.status(404).json({ error: '해당 댓글을 찾을 수 없습니다.' });
    }

    if (comment.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: '본인이 작성한 댓글만 수정할 수 있습니다.' });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { content },
    });

    res.status(200).json(updatedComment); // 수정된 댓글 응답으로 반환
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};

// 게시글 댓글 수정
exports.updateArticleComment = async (req, res, next) => {
  const { id } = req.params; // 댓글 ID 가져오기 (댓글을 수정하려면 수정하려는 댓글 고유 ID를 알아야됨 => 1번 댓글을 수정하고싶다 )
  const { content } = req.body; // 수정할 댓글 내용 가져오기

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!comment) {
      return res.status(404).json({ error: '해당 댓글을 찾을 수 없습니다.' });
    }

    if (comment.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: '본인이 작성한 댓글만 수정할 수 있습니다.' });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { content },
    });

    res.status(200).json(updatedComment); // 수정된 댓글 응답으로 반환
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};

// 상품 댓글 삭제
exports.deleteProductComment = async (req, res, next) => {
  const { id } = req.params; // 댓글 ID 가져오기 (댓글을 삭제하려면 삭제하려는 댓글 고유 ID를 알아야됨 => 1번 댓글을 삭제하고싶다)

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!comment) {
      return res.status(404).json({ error: '해당 댓글을 찾을 수 없습니다.' });
    }

    if (comment.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: '본인이 작성한 댓글만 삭제할 수 있습니다.' });
    }

    await prisma.comment.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: '댓글이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};

// 게시글 댓글 삭제
exports.deleteArticleComment = async (req, res, next) => {
  const { id } = req.params; // 댓글 ID 가져오기 (댓글을 삭제하려면 삭제하려는 댓글 고유 ID를 알아야됨 => 1번 댓글을 삭제하고싶다)

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!comment) {
      return res.status(404).json({ error: '해당 댓글을 찾을 수 없습니다.' });
    }

    if (comment.userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: '본인이 작성한 댓글만 삭제할 수 있습니다.' });
    }

    await prisma.comment.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: '댓글이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    next(error); // 에러가 있으면 다음 미들웨어로 전달
  }
};
