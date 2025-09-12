import Link from "next/link"

export function Header() {
  return (
    <header className="bg-brandBlue text-white shadow-header">
      <div className="mx-auto flex max-w-6xl items-center gap-4 p-3">
        <Link href="/" className="text-xl font-bold">
          MH STORE
        </Link>
        <div className="flex-1">
          <form className="relative">
            <input
              className="w-full rounded-md border border-white/20 bg-white/95 px-4 py-2 pr-12 text-gray-900 placeholder-gray-500 focus:outline-none"
              placeholder="Bạn cần tìm gì hôm nay?"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md bg-brandYellow px-3 py-1.5 text-sm font-semibold text-black"
            >
              Tìm
            </button>
          </form>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/products" className="hover:underline">
            Sản phẩm
          </Link>
          <Link href="/cart" className="relative inline-flex items-center gap-1 hover:underline">
            Giỏ hàng
            <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brandYellow px-1.5 text-xs font-bold text-black">
              0
            </span>
          </Link>
          <Link href="/auth/login" className="hover:underline">
            Đăng nhập
          </Link>
        </nav>
      </div>
    </header>
  )
}
