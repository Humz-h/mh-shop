export function HeroBanner() {
    return (
      <div className="mx-auto max-w-6xl p-3">
        <div className="rounded-xl px-6 py-10 sm:py-12 text-white shadow-card" style={{ backgroundColor: "#1e40af" }}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Lễ hội Tivi</h2>
              <p className="text-white/90">Tặng thêm inch, không thêm tiền. Trả góp 0%.</p>
            </div>
            <button
              className="mt-2 w-fit rounded-md px-5 py-2.5 text-sm font-semibold text-black sm:mt-0"
              style={{ backgroundColor: "#fbbf24" }}
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    )
  }
  