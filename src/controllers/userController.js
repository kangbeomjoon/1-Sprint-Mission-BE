// userController.js

import * as userService from '../services/userService.js';
import {
  ValidationError,
  UnauthorizedError,
} from '../middlewares/errorMiddleware.js';

// 현재 사용자 정보 가져오기
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await userService.getUserProfile(req.user.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// 현재 사용자 정보 업데이트
export const updateCurrentUser = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUserProfile(
      req.user.id,
      req.body
    );
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// 비밀번호 변경
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await userService.changeUserPassword(
      req.user.id,
      currentPassword,
      newPassword
    );
    res.json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message });
    } else {
      next(error);
    }
  }
};

// 내가 등록한 상품 조회
export const getMyProducts = async (req, res, next) => {
  try {
    const products = await userService.getMyProducts(req.user.id);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// 내가 좋아요한 상품 조회
export const getMyFavorites = async (req, res, next) => {
  try {
    const favorites = await userService.getMyFavorites(req.user.id);
    res.json(favorites);
  } catch (error) {
    next(error);
  }
};

// 사용자 정보 가져오기
export const getMe = async (req, res, next) => {
  try {
    console.log('getMe 요청 시작');

    const user = req.user;

    if (!user) {
      throw new UnauthorizedError('인증된 사용자가 아닙니다.');
    }

    const userInfo = {
      id: user.id,
      nickname: user.nickname,
      email: user.email,
    };

    console.log('getMe 성공:', userInfo);

    res.json(userInfo);
  } catch (error) {
    console.error('getMe 에러:', error);
    next(error);
  }
};
