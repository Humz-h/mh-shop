"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchBanners } from "@/services/banner";
import { getImageUrl } from "@/lib/utils";
import type { Banner } from "@/types/banner";

const BannerCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const data = await fetchBanners("HOME_TOP");
        setBanners(data);
        if (data.length > 0) {
          setCurrentIndex(0);
        }
      } catch {
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };

    loadBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const getBannerUrl = (banner: Banner): string => {
    if (banner.redirectType === "URL" && banner.redirectValue) {
      return banner.redirectValue;
    }
    if (banner.redirectType === "PRODUCT" && banner.redirectValue) {
      return `/products/${banner.redirectValue}`;
    }
    if (banner.redirectType === "CATEGORY" && banner.redirectValue) {
      return `/shop-with-sidebar?category=${banner.redirectValue}`;
    }
    return "#";
  };

  if (loading) {
    return null;
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="relative z-1 rounded-[10px] bg-white overflow-hidden">
      <div className="relative w-full" style={{ minHeight: '400px' }}>
        {banners.map((banner, index) => (
          <Link
            key={banner.id}
            href={getBannerUrl(banner)}
            className={`block absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Image
              src={getImageUrl(banner.imageUrl)}
              alt={banner.title}
              width={757}
              height={400}
              className="w-full h-auto object-cover"
              priority={index === 0}
            />
          </Link>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/80 hover:bg-white transition-colors shadow-lg"
            aria-label="Previous banner"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/80 hover:bg-white transition-colors shadow-lg"
            aria-label="Next banner"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.5 15L12.5 10L7.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BannerCarousel;

