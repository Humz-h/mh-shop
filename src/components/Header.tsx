import Link from "next/link";

export function Header() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" className="text-lg font-semibold">mh-shop</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/products">Products</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/auth/login">Login</Link>
        </nav>
      </div>
    </header>
  );
} 