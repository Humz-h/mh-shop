export default function LoginPage() {
  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold">Login</h1>
      <form className="mt-4 space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Email" />
        <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password" />
        <button className="w-full bg-black text-white px-4 py-2 rounded">Sign in</button>
      </form>
    </main>
  );
} 