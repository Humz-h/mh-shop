export function HeroBanner() {
  return (
    <div className="mx-auto max-w-6xl p-3">
      <div className="rounded-lg bg-brandBlue/95 p-6 text-white shadow-card">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Lễ hội Tivi</h2>
            <p className="text-white/90">Tặng thêm inch, không thêm tiền. Trả góp 0%.</p>
          </div>
          <button className="mt-2 w-fit rounded-md bg-brandYellow px-4 py-2 text-sm font-semibold text-black sm:mt-0">Mua ngay</button>
        </div>
      </div>
    </div>
  );
} 