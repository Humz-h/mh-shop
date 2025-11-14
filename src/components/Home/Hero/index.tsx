import React from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

const Hero = () => {
  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-20 sm:pt-24 lg:pt-30 xl:pt-32 bg-[#E5EAF4]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-5">
          <div className="xl:max-w-[757px] w-full">
            <div className="relative z-1 rounded-[10px] bg-white overflow-hidden">
              {/* <!-- bg shapes --> */}
              <Image
                src="/images/hero/hero-bg.png"
                alt="hero bg shapes"
                className="absolute right-0 bottom-0 -z-1"
                width={534}
                height={520}
              />

              <HeroCarousel />
            </div>
          </div>

          <div className="xl:max-w-[393px] w-full">
            <div className="flex flex-col sm:flex-row xl:flex-col gap-5">
              <div className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5 shadow-1 hover:shadow-2 transition-shadow">
                <div className="flex items-center gap-4 sm:gap-8">
                  <div className="flex-1">
                    <h2 className="font-semibold text-dark text-lg sm:text-xl mb-3 sm:mb-4">
                      <a href="#" className="hover:text-blue transition-colors">iPhone 14 Plus & 14 Pro Max</a>
                    </h2>

                    <div>
                      <p className="font-medium text-dark-4 text-custom-sm mb-1.5 uppercase">
                        limited time offer
                      </p>
                      <span className="flex items-center gap-3">
                        <span className="font-semibold text-lg sm:text-xl text-red">
                          {formatCurrency(699000, "VND")}
                        </span>
                        <span className="font-medium text-base sm:text-lg text-dark-4 line-through">
                          {formatCurrency(999000, "VND")}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <Image
                      src="/images/hero/hero-02.png"
                      alt="mobile image"
                      width={123}
                      height={161}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5 shadow-1 hover:shadow-2 transition-shadow">
                <div className="flex items-center gap-4 sm:gap-8">
                  <div className="flex-1">
                    <h2 className="font-semibold text-dark text-lg sm:text-xl mb-3 sm:mb-4">
                      <a href="#" className="hover:text-blue transition-colors">Wireless Headphone</a>
                    </h2>

                    <div>
                      <p className="font-medium text-dark-4 text-custom-sm mb-1.5 uppercase">
                        limited time offer
                      </p>
                      <span className="flex items-center gap-3">
                        <span className="font-semibold text-lg sm:text-xl text-red">
                          {formatCurrency(699000, "VND")}
                        </span>
                        <span className="font-medium text-base sm:text-lg text-dark-4 line-through">
                          {formatCurrency(999000, "VND")}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <Image
                      src="/images/hero/hero-01.png"
                      alt="mobile image"
                      width={123}
                      height={161}
                    />
                  </div>
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Hero features --> */}
      <HeroFeature />
    </section>
  );
};

export default Hero;
