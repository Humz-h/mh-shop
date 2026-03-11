"use client";

import React, { useState, useEffect } from "react";
import HeroFeature from "./HeroFeature";
import BannerGrid from "@/components/Banner/BannerGrid";
import Image from "next/image";
import { fetchBanners } from "@/services/banner";

const Hero = () => {
  const [hasBanners, setHasBanners] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkBanners = async () => {
      try {
        const banners = await fetchBanners("HOME_TOP");
        setHasBanners(banners.length > 0);
      } catch {
        setHasBanners(false);
      } finally {
        setLoading(false);
      }
    };

    checkBanners();
  }, []);

  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-20 sm:pt-24 lg:pt-30 xl:pt-32 bg-gradient-to-br from-[#E8ECF4] via-[#E5EAF4] to-[#DDE4F0]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="relative">
          <Image
            src="/images/hero/hero-bg.png"
            alt="hero bg shapes"
            className="absolute right-0 bottom-0 -z-1"
            width={534}
            height={520}
          />

          {!loading && hasBanners ? <BannerGrid /> : null}
        </div>
      </div>

      <HeroFeature />
    </section>
  );
};

export default Hero;
