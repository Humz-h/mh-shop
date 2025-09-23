import { Facebook, Instagram, Twitter, Youtube } from "@/components/UI/icons"
import { Button } from "@/components/UI/Button"

export function Footer() {
  return (
    <footer className="bg-muted mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground px-3 py-2 rounded-lg font-bold text-xl">MH</div>
              <span className="font-bold text-xl">MHShop</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Nền tảng thương mại điện tử hàng đầu Việt Nam, mang đến trải nghiệm mua sắm tuyệt vời với hàng triệu sản
              phẩm chất lượng.
            </p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Customer service */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Chăm sóc khách hàng</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Trung tâm trợ giúp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Hướng dẫn mua hàng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Hướng dẫn bán hàng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Thanh toán
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Vận chuyển
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Trả hàng & Hoàn tiền
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Về MHShop</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Giới thiệu về MHShop
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Tuyển dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Điều khoản MHShop
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Chính hãng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Kênh người bán
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Liên hệ</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>📞</span>
                <span>1900 1234</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✉️</span>
                <span>support@mhshop.vn</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5">📍</span>
                <span>
                  Tầng 4-5-6, Tòa nhà Capital Place, số 29 đường Liễu Giai, Phường Ngọc Khánh, Quận Ba Đình, Thành phố
                  Hà Nội
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Đăng ký nhận tin</h4>
              <div className="flex gap-2">
                <input type="email" placeholder="Email của bạn" className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-sm" />
                <Button size="sm">Đăng ký</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="my-8 border-t" />

        {/* Bottom footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
              <span>© 2024 MHShop. Tất cả quyền được bảo lưu.</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Quốc gia & Khu vực: Việt Nam</span>
            <span>|</span>
            <span>Tiếng Việt</span>
          </div>
        </div>
      </div>
    </footer>
  )
} 