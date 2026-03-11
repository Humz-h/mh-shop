"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchBanners } from "@/services/banner";
import { getImageUrl } from "@/lib/utils";
import type { Banner } from "@/types/banner";

const ArrowLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BannerGrid = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const data = await fetchBanners("HOME_TOP");
        setBanners(data);
      } catch {
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };

    loadBanners();
  }, []);

  const carouselBannersList = [banners[0], banners[3]].filter(Boolean);
  useEffect(() => {
    if (carouselBannersList.length <= 1) return;
    const interval = setInterval(() => {
      setCarouselIndex((i) => (i + 1) % carouselBannersList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselBannersList.length]);

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

  const banner0 = banners[0];
  const banner1 = banners[1];
  const banner2 = banners[2];
  const banner3 = banners[3];

  const carouselBanners = [banner0, banner3].filter(Boolean);
  const hasCarousel = carouselBanners.length > 1;

  const goPrev = () => setCarouselIndex((i) => (i - 1 + carouselBanners.length) % carouselBanners.length);
  const goNext = () => setCarouselIndex((i) => (i + 1) % carouselBanners.length);

  return (
    <div className="flex flex-wrap gap-5">
      {/* Banner 0 & 3 - Carousel bên trái với mũi tên */}
      {(banner0 || banner3) && (
        <div className="xl:max-w-[757px] w-full">
          <div className="relative z-1 rounded-xl bg-white overflow-hidden shadow-1 hover:shadow-2 transition-all duration-300 group">
            {hasCarousel ? (
              <>
                <div className="relative w-full aspect-[757/400] overflow-hidden">
                  {carouselBanners.map((banner, index) => (
                    <Link
                      key={banner.id}
                      href={getBannerUrl(banner)}
                      className={`block absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === carouselIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                      }`}
                    >
                      <Image
                        src={getImageUrl(banner.imageUrl)}
                        alt={banner.title}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        sizes="(max-width: 1280px) 100vw, 757px"
                      />
                    </Link>
                  ))}
                </div>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); goPrev(); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-200 opacity-80 md:opacity-0 md:group-hover:opacity-100 hover:scale-110 text-gray-800"
                  aria-label="Banner trước"
                >
                  <ArrowLeft />
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); goNext(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-200 opacity-80 md:opacity-0 md:group-hover:opacity-100 hover:scale-110 text-gray-800"
                  aria-label="Banner tiếp theo"
                >
                  <ArrowRight />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {carouselBanners.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.preventDefault(); setCarouselIndex(i); }}
                      className={`h-2 rounded-full transition-all ${
                        i === carouselIndex ? "w-8 bg-white" : "w-2 bg-white/60 hover:bg-white/80"
                      }`}
                      aria-label={`Banner ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <Link href={getBannerUrl(carouselBanners[0])} className="block relative w-full aspect-[757/400]">
                <Image
                  src={getImageUrl(carouselBanners[0].imageUrl)}
                  alt={carouselBanners[0].title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1280px) 100vw, 757px"
                />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Banner 1, 2 - Bên phải, nhỏ */}
      {(banner1 || banner2) && (
        <div className="xl:max-w-[393px] w-full flex-1 xl:flex-none">
          <div className="flex flex-col sm:flex-row xl:flex-col gap-5 h-full">
            {banner1 && (
              <div className="w-full flex-1 relative rounded-xl bg-white overflow-hidden shadow-1 hover:shadow-2 transition-all duration-300">
                <Link href={getBannerUrl(banner1)} className="block relative w-full h-full min-h-[190px] xl:min-h-[192.5px]">
                  <Image
                    src={getImageUrl(banner1.imageUrl)}
                    alt={banner1.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1280px) 100vw, 393px"
                  />
                </Link>
              </div>
            )}

            {banner2 && (
              <div className="w-full flex-1 relative rounded-xl bg-white overflow-hidden shadow-1 hover:shadow-2 transition-all duration-300">
                <Link href={getBannerUrl(banner2)} className="block relative w-full h-full min-h-[190px] xl:min-h-[192.5px]">
                  <Image
                    src={getImageUrl(banner2.imageUrl)}
                    alt={banner2.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1280px) 100vw, 393px"
                  />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerGrid;

