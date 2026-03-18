# MH Shop — Bản đồ dự án (Project Map)

Tài liệu này giúp bạn “đọc dự án theo luồng”: **UI (pages/components) → state/context → service gọi API → utils/types**. Mục tiêu là biết “chức năng nằm ở đâu” và “móc nối qua lại thế nào”.

> Dự án dùng **Next.js App Router** (Next 15), UI client components, **Redux Toolkit** cho cart/wishlist/quickview, và nhiều **React Context** cho auth + modal.

---

## 1) Tổng quan kiến trúc

- **Routing (Next App Router)**: `src/app/**`
  - Mỗi route có `page.tsx` (và đôi khi `layout.tsx`) để render UI.
- **UI Components**: `src/components/**`
  - Component “khối” lớn (Home, Cart, Header, Footer, …) và các common/UI components.
- **State**
  - **Redux**: `src/redux/**` (cart, wishlist, quickView, productDetails…)
  - **React Context**: `src/app/context/**` (Auth, modal quick view, cart sidebar, preview slider…)
- **Service layer (gọi API)**: `src/services/**`
  - Wrapper gọi backend qua `apiFetch` (`src/lib/api.ts`)
  - Có mapping/normalize response để phù hợp format nội bộ của app (ví dụ `Order`).
- **Helpers / Utilities**: `src/lib/**`
  - `apiFetch`, format tiền, xử lý URL ảnh, …
- **Types**: `src/types/**`

---

## 2) Entry points quan trọng (điểm “móc nối” lớn nhất)

### 2.1 Root layout (khung bao toàn app)

File: `src/app/layout.tsx`

Vai trò:
- Bọc toàn bộ UI trong các Provider (Redux + Auth + modal contexts).
- Render các phần “global” như `Header`, `Footer`, các modal (QuickView, CartSidebar, PreviewSlider), widget (chat), scroll-to-top…

Móc nối chính:
- **ReduxProvider**: `src/redux/provider.tsx` → `src/redux/store.ts`
- **AuthProvider**: `src/app/context/AuthContext.tsx` → gọi `src/services/auth.ts`
- **Các modal providers**: `src/app/context/*` → điều khiển modal/sidebars ở mọi trang

---

## 3) Map routes (pages) → component nào → phụ thuộc gì

> Đây là cách đọc nhanh: mở file `page.tsx` để biết route render component gì, rồi lần theo component đó.

### 3.1 Home
- **Route**: `/`
- **File**: `src/app/page.tsx`
- **Render**: `src/components/Home`

### 3.2 Sản phẩm (list)
- **Route**: `/products`
- **File**: `src/app/products/page.tsx`
- **Logic**:
  - Load danh sách sản phẩm qua hook `useProducts` (`src/hooks/useProducts`).
  - Click item → đi `/products/[id]`
  - “Thêm vào giỏ” có 2 nhánh:
    - Lưu fallback vào `localStorage.cart`
    - Điều hướng sang `/cart?...params` để cart có thể dựng lại từ query/localStorage

### 3.3 Sản phẩm (detail)
- **Route**: `/products/[id]`
- **File**: `src/app/products/[id]/page.tsx`
- **Logic**:
  - `fetchProductById` từ `src/services/product.ts`
  - Add-to-cart dùng Redux action `addItemToCart` (`src/redux/features/cart-slice`)
  - Favorite button: `src/components/Common/FavoriteButton` (thường sẽ liên quan `src/services/favorite.ts` hoặc state local)

### 3.4 Giỏ hàng
- **Route**: `/cart`
- **File**: `src/app/cart/page.tsx`
- **Render**: `src/components/Cart`
- **State chính**: Redux cart slice (`src/redux/features/cart-slice`)

### 3.5 Checkout (đặt hàng)
- **Route**: `/checkout`
- **File**: `src/app/checkout/page.tsx`
- **Luồng**:
  - Guard auth: nếu chưa login → redirect `/signin?redirect=/checkout`
  - Lấy cart items từ Redux (`state.cartReducer.items`) và map sang format checkout
  - Pre-fill `fullName/phone` từ `AuthContext`
  - (Optional) check tồn kho bằng `fetchProductById` (service product)
  - Submit → `createOrder` (`src/services/order.ts`)
  - Thành công → `removeAllItemsFromCart()` và redirect `/dashboard`

### 3.6 Dashboard (đơn hàng)
- **Route**: `/dashboard`
- **File**: `src/app/dashboard/page.tsx`
- **Luồng**:
  - Guard auth: nếu chưa login → redirect `/signin`
  - Fetch list orders: `getOrders` (`src/services/order.ts`) theo `customerId`
  - Render từng order bằng `src/components/OrderCard.tsx`
  - “Load more” theo page (đơn giản: `hasMore` dựa trên `newOrders.length === pageSize`)

### 3.7 Auth UI
Bạn có các route auth/signin/signup:
- `src/app/signin/page.tsx`
- `src/app/signup/page.tsx`
- `src/app/auth/login/page.tsx`
- `src/app/auth/register/page.tsx`

Chúng thường sẽ:
- Gọi `src/services/auth.ts` (login/register)
- Lưu token/customer vào `localStorage` qua `AuthContext` (hoặc tự lưu)

---

## 4) State management: Redux vs Context (tại sao có 2 loại)

### 4.1 Redux (`src/redux/*`)

Files:
- `src/redux/store.ts`: cấu hình store + typed hooks
- `src/redux/provider.tsx`: Provider bọc ở layout
- `src/redux/features/*`: slices

Các slice đang được gắn vào store:
- `quickViewReducer` → `src/redux/features/quickView-slice`
- `cartReducer` → `src/redux/features/cart-slice`
- `wishlistReducer` → `src/redux/features/wishlist-slice`
- `productDetailsReducer` → `src/redux/features/product-details`

Khi nào dùng Redux trong dự án này:
- Các state “dùng ở nhiều nơi” và cần thao tác theo action (cart/wishlist/quick view…).

### 4.2 Context (`src/app/context/*`)

Ví dụ lớn nhất: `AuthContext`
- File: `src/app/context/AuthContext.tsx`
- Hook dùng: thường qua `src/hooks/useAuth` (wrapper), hoặc `useAuth()` trực tiếp.

`AuthContext` quản lý:
- `customer`, `token`, `isAuthenticated`, `isLoading`
- API: update profile, upload avatar, change password…

Khi nào dùng Context trong dự án này:
- Các state “global UI/session” (đăng nhập, modal open/close) mà không nhất thiết cần Redux reducers.

---

## 5) Service layer (API) — gọi backend ở đâu, chuẩn hoá ra sao

### 5.1 `apiFetch` (hạt nhân gọi API)

File: `src/lib/api.ts`

Vai trò:
- Ghép base URL từ `NEXT_PUBLIC_API_URL` (fallback `http://localhost:5000`)
- Set header JSON mặc định
- Chuẩn hoá error message (đọc text/JSON nếu có)
- Detect lỗi network và trả message tiếng Việt

### 5.2 Auth service

File: `src/services/auth.ts`

Điểm đáng chú ý:
- `getCurrentUser(token)` thử nhiều endpoint `/api/auth/me` và `/api/Auth/me` (khác casing).
- `uploadAvatar`, `updateProfile`, `changePassword` gọi thẳng `fetch` với `API_URL` (không qua `apiFetch`) vì:
  - upload multipart/form-data
  - một số endpoint cần format riêng

Móc nối:
- `AuthContext` gọi các hàm này để cập nhật state + localStorage.

### 5.3 Order service

File: `src/services/order.ts`

Có 3 nhóm chức năng:
- **List orders**: `getOrders(params)`
  - Gọi `/api/Orders?...`
  - Normalize status về lowercase (`pending/paid/...`)
  - Hỗ trợ backend trả items dưới nhiều field: `orderDetails` hoặc `items` hoặc `orderItems`
  - Map sang format nội bộ `Order` cho UI
- **Create order**: `createOrder(orderData)`
  - POST `/api/Orders`
  - Dùng ở `/checkout`
- **Order details**: `getOrderDetails(orderId)`
  - GET `/api/order-details/order/${orderId}`
  - Dùng trong `OrderCard` khi bấm “Xem chi tiết”

Helpers UI:
- `getStatusText`, `getStatusColor`, `formatCurrency`, `formatDate`

---

## 6) Component case study: `OrderCard` (ví dụ “móc nối” rõ nhất)

File: `src/components/OrderCard.tsx`

Luồng:
- Nhận prop `order` (đã normalize từ `getOrders`)
- Tính `finalAmount = total + shipping - discount`
- Khi bấm “Xem chi tiết”:
  - gọi `getOrderDetails(order.id)`
  - render danh sách sản phẩm chi tiết (có image, code, mô tả…)

Dependencies:
- `src/services/order.ts`: `getOrderDetails`, `getStatusText`, `formatDate`
- `src/lib/utils.ts`: `getImageUrl`, `formatCurrency`
- `next/image` để tối ưu ảnh (được cho phép domain ở `next.config.ts`)

---

## 7) Ảnh & cấu hình domain

### 7.1 Tạo URL ảnh hiển thị

File: `src/lib/utils.ts` → `getImageUrl(imageUrl)`

Quy tắc:
- Nếu đã là `http(s)` → dùng nguyên
- Nếu là path local public (`/images/...`) → dùng nguyên
- Còn lại → prepend `NEXT_PUBLIC_API_URL` (fallback `http://localhost:5000`)

### 7.2 Allow domains cho `next/image`

File: `next.config.ts`

Cho phép load ảnh từ:
- `http://localhost:5000/**`
- `https://dienmayxanh.com/**`
- `https://logowik.com/**`

---

## 8) “Luồng đọc dự án” gợi ý (nên vọc theo thứ tự này)

- **Khung app + providers**: `src/app/layout.tsx`
- **Auth/session**: `src/app/context/AuthContext.tsx` → `src/services/auth.ts`
- **Cart**:
  - Redux store: `src/redux/store.ts`
  - Cart slice: `src/redux/features/cart-slice`
  - UI cart: `src/app/cart/page.tsx` → `src/components/Cart`
- **Checkout → Order**:
  - `src/app/checkout/page.tsx`
  - `src/services/order.ts`
  - `src/app/dashboard/page.tsx` + `src/components/OrderCard.tsx`
- **Products**:
  - `src/app/products/page.tsx` + `src/hooks/useProducts`
  - `src/app/products/[id]/page.tsx` + `src/services/product.ts`

---

## 9) TODO (chỗ dễ “mất dấu” khi đọc)

- **Cart lưu 2 nơi**: Redux cart slice *và* `localStorage.cart` (đặc biệt ở `ProductsPage`).
- **Auth endpoint casing**: `/api/auth/me` vs `/api/Auth/me` (backend có thể không thống nhất).
- **Order items format**: backend có thể trả `orderDetails/items/orderItems` → đã normalize trong `getOrders`.

---

## 10) Nếu bạn muốn mình viết “bản đồ chi tiết hơn”

Mình có thể mở rộng thêm các phần (nếu bạn muốn):
- Map đầy đủ tất cả routes trong `src/app/*` (search, wishlist, profile, shop-with-sidebar, group…)
- Map từng service (`product`, `cart`, `category`, `banner`, `favorite`) với endpoint + nơi dùng trong UI
- Vẽ “sequence diagram” cho 3 luồng quan trọng: **Login**, **Add to Cart**, **Checkout → Create Order → Dashboard**

