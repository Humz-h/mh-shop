import Link from "next/link"

const ITEMS = [
  { label: "Máy giặt", href: "/products?cat=may-giat" },
  { label: "Tivi", href: "/products?cat=tivi" },
  { label: "Tủ lạnh", href: "/products?cat=tu-lanh" },
  { label: "Nồi chiên", href: "/products?cat=noi-chien" },
  { label: "Máy lọc nước", href: "/products?cat=may-loc-nuoc" },
  { label: "Hút bụi", href: "/products?cat=hut-bui" },
  { label: "Gia dụng", href: "/products?cat=gia-dung" },
  { label: "Tất cả", href: "/products" },
]

export function CategoryGrid() {
  return (
    <div className="mx-auto max-w-6xl p-3">
      <div className="grid grid-cols-2 gap-3 rounded-lg bg-white p-3 shadow-card sm:grid-cols-4">
        {ITEMS.map((i) => (
          <Link
            key={i.label}
            href={i.href}
            className="flex flex-col items-center rounded-md p-3 ring-1 ring-gray-200 hover:bg-gray-50"
          >
            <div className="mb-2 h-12 w-12 rounded-full bg-brandBlue/10" />
            <div className="text-sm font-medium text-gray-800">{i.label}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
export default CategoryGrid;
