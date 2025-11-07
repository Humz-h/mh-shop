/**
 * Cấu hình tỉ lệ hình ảnh sản phẩm
 * 
 * Có thể thay đổi giá trị này để điều chỉnh tỉ lệ cho tất cả ảnh sản phẩm.
 * Chỉ cần thay đổi giá trị constant này, tất cả ảnh sản phẩm sẽ tự động cập nhật.
 * 
 * Các tỉ lệ phổ biến:
 * - "aspect-square" (1:1) - Vuông - Mặc định
 * - "aspect-[4/3]" (4:3) - Phổ biến cho sản phẩm điện tử
 * - "aspect-[3/4]" (3:4) - Dọc (portrait) - Phù hợp cho sản phẩm cao
 * - "aspect-[16/9]" (16:9) - Ngang (landscape) - Phù hợp cho banner
 * - "aspect-[3/2]" (3:2) - Phổ biến cho ảnh sản phẩm
 * - "aspect-[5/4]" (5:4) - Tỉ lệ trung bình
 * 
 * Ví dụ: Để thay đổi sang tỉ lệ 4:3, chỉ cần đổi:
 * export const PRODUCT_IMAGE_ASPECT_RATIO = "aspect-[4/3]";
 */

export const PRODUCT_IMAGE_ASPECT_RATIO = "aspect-[4/3]";

/**
 * Tỉ lệ ảnh cho trang chi tiết sản phẩm
 * Có thể đặt tỉ lệ khác với danh sách sản phẩm nếu cần
 */
export const PRODUCT_DETAIL_IMAGE_ASPECT_RATIO = "aspect-square";

