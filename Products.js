const mongoose = require("mongoose");

// Product 스키마 정의
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // 제품명 필수 입력
    description: { type: String, required: true }, // 제품 설명 필수 입력
    price: { type: Number, required: true }, // 가격 필수 입력
    tags: [String], // 태그는 문자열 배열
    createdAt: { type: Date, default: Date.now }, // 생성 날짜, 기본값으로 현재 날짜/시간
    updatedAt: { type: Date, default: Date.now }, // 업데이트 날짜, 기본값으로 현재 날짜/시간
  },
  { timestamps: true }
); // 자동으로 createdAt 및 updatedAt을 관리

// 필요에 따라 추가적인 필드
productSchema.add({
  imageUrl: String, // 이미지 URL, 선택적 필드
  status: { type: String, default: "available" }, // 제품 상태, 기본값 'available'
});

// Product 모델 생성
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
