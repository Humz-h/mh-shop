"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchBanners } from "@/services/banner";
import { getImageUrl } from "@/lib/utils";
import type { Banner } from "@/types/banner";

const PopupBanner = () => {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const loadBanner = async () => {
      try {
        const banners = await fetchBanners("POPUP");
        if (banners.length > 0) {
          const popupBanner = banners[0];
          
          const storageKey = `popup_banner_${popupBanner.id}_closed`;
          const wasClosed = localStorage.getItem(storageKey);
          
          if (!wasClosed) {
            setBanner(popupBanner);
            setTimeout(() => setIsVisible(true), 500);
          }
        }
      } catch {
      }
    };

    loadBanner();
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      if (banner) {
        localStorage.setItem(`popup_banner_${banner.id}_closed`, "true");
      }
    }, 300);
  };

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

  if (!banner || !isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 transition-opacity duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative max-w-[90%] sm:max-w-[600px] w-full bg-white rounded-lg shadow-2xl transition-transform duration-300 ${
          isClosing ? "scale-95" : "scale-100"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute -top-4 -right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-gray-1 transition-colors shadow-lg"
          aria-label="Close popup"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <Link href={getBannerUrl(banner)} className="block">
          <Image
            src={getImageUrl(banner.imageUrl)}
            alt={banner.title}
            width={600}
            height={400}
            className="w-full h-auto rounded-lg"
            priority
          />
        </Link>
      </div>
    </div>
  );
};

export default PopupBanner;

