import Link from "next/link";

const CATEGORIES = [
  { slug: "may-giat", label: "Máy giặt" },
  { slug: "tivi", label: "Tivi" },
  { slug: "tu-lanh", label: "Tủ lạnh" },
  { slug: "noi-chien", label: "Nồi chiên" },
  { slug: "may-loc-nuoc", label: "Máy lọc nước" },
  { slug: "hut-bui", label: "Hút bụi" },
  { slug: "gia-dung", label: "Gia dụng" },
];

export function CategoryNav() {
  return (
    <div className="bg-white shadow-header">
      <div className="mx-auto max-w-6xl overflow-x-auto">
        <nav className="flex gap-3 p-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/products?cat=${c.slug}`}
              className="whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-800 ring-1 ring-gray-200 hover:bg-gray-50"
            >
              {c.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
} 