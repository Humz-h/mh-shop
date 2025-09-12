import { Facebook, Instagram, Twitter, Youtube } from "@/components/UI/icons"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t mt-16">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">MH</span>
              </div>
              <span className="font-bold text-xl">MH Shop</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Cửa hàng điện tử uy tín với hơn 10 năm kinh nghiệm. Chúng tôi cam kết mang đến những sản phẩm chất lượng
              nhất.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Youtube className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  Chính sách bảo hành
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  Hướng dẫn mua hàng
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  Câu hỏi thường gặp
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold">Danh mục sản phẩm</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  Điện thoại
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  Laptop
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  Phụ kiện
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  Đồng hồ thông minh
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">Liên hệ</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>📍 123 Đường ABC, Quận 1, TP.HCM</li>
              <li>📞 (028) 1234 5678</li>
              <li>✉️ info@mhshop.com</li>
              <li>🕒 8:00 - 22:00 (Thứ 2 - CN)</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 MH Shop. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
} 