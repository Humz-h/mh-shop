"use client"

import Image from "next/image"
import { useState, useEffect } from "react"

const BANNER_IMAGES = [
  "/84ee8768df2aa0e32f116dd550e8d156.png",
  "/171d15e0ec1f19c11d65880b3b9681f4.png", 
  "/ad41eb1eb048708e8b68d38f28e56e18.png",
  "/95e06291048a2f1e783c5da90380ea6b.png",
  "/134e7ced5b22a7296a3472125c3f6891.png"
]

export function MainBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  // Auto play functionality
  useEffect(() => {
    if (!isAutoPlay) return
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_IMAGES.length)
    }, 4000) // Change slide every 4 seconds

    return () => clearInterval(interval)
  }, [isAutoPlay])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % BANNER_IMAGES.length)
    setIsAutoPlay(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + BANNER_IMAGES.length) % BANNER_IMAGES.length)
    setIsAutoPlay(false)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlay(false)
  }

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden group">
      {/* Banner Images Container */}
      <div className="relative w-full h-full">
        {BANNER_IMAGES.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
              index === currentSlide 
                ? 'translate-x-0' 
                : index < currentSlide 
                  ? '-translate-x-full' 
                  : 'translate-x-full'
            }`}
          >
            <Image
              src={image}
              alt={`Banner ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Only show on hover */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black bg-opacity-40 hover:bg-opacity-60 text-white text-2xl font-light flex items-center justify-center transition-all duration-300 z-10 backdrop-blur-sm shadow-lg hover:shadow-xl opacity-0 group-hover:opacity-100"
      >
        ‹
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black bg-opacity-40 hover:bg-opacity-60 text-white text-2xl font-light flex items-center justify-center transition-all duration-300 z-10 backdrop-blur-sm shadow-lg hover:shadow-xl opacity-0 group-hover:opacity-100"
      >
        ›
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {BANNER_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
