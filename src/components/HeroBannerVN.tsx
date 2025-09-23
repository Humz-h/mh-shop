"use client"

import { useMemo, useRef, useState, useEffect } from "react"

interface HeroBannerProps {
  images?: string[]
  autoPlayMs?: number
}

export function HeroBanner({
  images,
  autoPlayMs = 5000,
}: HeroBannerProps) {
  const banners = useMemo(
    () =>
      images && images.length > 0
        ? images
        : [
            "/84ee8768df2aa0e32f116dd550e8d156.png",
            "/95e06291048a2f1e783c5da90380ea6b.png",
            "/134e7ced5b22a7296a3472125c3f6891.png",
            "/171d15e0ec1f19c11d65880b3b9681f4.png",
            "/ad41eb1eb048708e8b68d38f28e56e18.png",
          ],
    [images]
  )

  const [index, setIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement | null>(null)

  const scrollToIndex = (i: number) => {
    const clamped = (i + banners.length) % banners.length
    setIndex(clamped)
    if (trackRef.current) {
      const container = trackRef.current
      const width = container.clientWidth
      container.scrollTo({ left: clamped * width, behavior: "smooth" })
    }
  }

  useEffect(() => {
    if (!autoPlayMs) return
    const id = setInterval(() => scrollToIndex(index + 1), autoPlayMs)
    return () => clearInterval(id)
  }, [index, autoPlayMs])

  // Keep snap position in sync on resize
  useEffect(() => {
    const onResize = () => scrollToIndex(index)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [index])

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
      >
        {banners.map((src, i) => (
          <div key={i} className="w-full flex-shrink-0 snap-center">
            <img
              src={src}
              alt={`banner-${i + 1}`}
              className="h-64 w-full object-contain sm:h-80 md:h-96 lg:h-[28rem]"
            />
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        aria-label="Previous"
        onClick={() => scrollToIndex(index - 1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-white hover:bg-black/55 z-10"
      >
        ‹
      </button>
      <button
        aria-label="Next"
        onClick={() => scrollToIndex(index + 1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-white hover:bg-black/55 z-10"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => scrollToIndex(i)}
            className={`h-2.5 w-2.5 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  )
}
  