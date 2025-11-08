"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Gift } from "@/components/UI/icons";

interface Product {
  id: string;
  name: string;
  image: string;
  specs: string[];
  currentPrice: number;
  originalPrice: number;
  sold: number;
  total: number;
}

const flashSaleProducts: Product[] = [
  {
    id: "1",
    name: "Tivi Samsung 55 inch QLED 4K",
    image: "/134e7ced5b22a7296a3472125c3f6891.png",
    specs: ["55 inch", "QLED 4K", "Smart TV", "HDR10+"],
    currentPrice: 12990000,
    originalPrice: 18990000,
    sold: 0,
    total: 5
  },
  {
    id: "2", 
    name: "Tủ lạnh LG Inverter 320L",
    image: "/171d15e0ec1f19c11d65880b3b9681f4.png",
    specs: ["320L", "Inverter", "2 cửa", "Tiết kiệm điện"],
    currentPrice: 8990000,
    originalPrice: 12990000,
    sold: 0,
    total: 8
  },
  {
    id: "3",
    name: "Điều hòa Daikin 1.5HP Inverter",
    image: "/84ee8768df2aa0e32f116dd550e8d156.png", 
    specs: ["1.5HP", "Inverter", "Làm lạnh nhanh", "Tiết kiệm điện"],
    currentPrice: 11990000,
    originalPrice: 15990000,
    sold: 0,
    total: 6
  },
  {
    id: "4",
    name: "Máy giặt LG 8kg Inverter",
    image: "/95e06291048a2f1e783c5da90380ea6b.png",
    specs: ["8kg", "Inverter", "Cửa trước", "Nhiều chế độ"],
    currentPrice: 9990000,
    originalPrice: 13990000,
    sold: 0,
    total: 10
  },
  {
    id: "5",
    name: "Quạt điện Senko 16 inch",
    image: "/placeholder-fan.png",
    specs: ["16 inch", "3 tốc độ", "Điều khiển từ xa", "Tiết kiệm điện"],
    currentPrice: 890000,
    originalPrice: 1290000,
    sold: 0,
    total: 15
  },
  {
    id: "6",
    name: "Lò vi sóng Sharp 20L",
    image: "/placeholder-microwave.png",
    specs: ["20L", "Nướng + Vi sóng", "Điều khiển điện tử", "An toàn"],
    currentPrice: 1990000,
    originalPrice: 2990000,
    sold: 0,
    total: 12
  },
  {
    id: "7",
    name: "Tivi TCL 50 inch 4K Smart",
    image: "/placeholder-tv.png",
    specs: ["50 inch", "4K UHD", "Android TV", "Dolby Vision"],
    currentPrice: 8990000,
    originalPrice: 12990000,
    sold: 0,
    total: 8
  },
  {
    id: "8",
    name: "Máy lạnh Panasonic 1HP",
    image: "/placeholder-ac.png",
    specs: ["1HP", "Inverter", "Làm lạnh nhanh", "Chống ẩm mốc"],
    currentPrice: 7990000,
    originalPrice: 11990000,
    sold: 0,
    total: 9
  },
  {
    id: "9",
    name: "Máy sấy tóc Philips 2000W",
    image: "/placeholder-hairdryer.png",
    specs: ["2000W", "3 tốc độ", "Ion âm", "Chống nóng"],
    currentPrice: 1290000,
    originalPrice: 1990000,
    sold: 0,
    total: 7
  },
  {
    id: "10",
    name: "Bàn ủi hơi nước Tefal",
    image: "/placeholder-iron.png",
    specs: ["2400W", "Hơi nước", "Chống vôi", "Tự động tắt"],
    currentPrice: 1890000,
    originalPrice: 2890000,
    sold: 0,
    total: 11
  },
  {
    id: "11",
    name: "Máy xay sinh tố Philips 1000W",
    image: "/placeholder-blender.png",
    specs: ["1000W", "4 lưỡi dao", "Inox 304", "Chống ồn"],
    currentPrice: 1590000,
    originalPrice: 2290000,
    sold: 0,
    total: 8
  },
  {
    id: "12",
    name: "Nồi cơm điện Tiger 1.8L",
    image: "/placeholder-ricecooker.png",
    specs: ["1.8L", "Nồi chống dính", "Hẹn giờ", "Tiết kiệm điện"],
    currentPrice: 890000,
    originalPrice: 1290000,
    sold: 0,
    total: 15
  },
  {
    id: "13",
    name: "Máy lọc nước RO 9 cấp",
    image: "/placeholder-waterfilter.png",
    specs: ["9 cấp lọc", "RO", "UV", "Tự động sục rửa"],
    currentPrice: 3990000,
    originalPrice: 5990000,
    sold: 0,
    total: 6
  },
  {
    id: "14",
    name: "Bếp từ đôi Sunhouse 2000W",
    image: "/placeholder-induction.png",
    specs: ["2000W", "Đôi", "Cảm ứng", "An toàn"],
    currentPrice: 2190000,
    originalPrice: 3290000,
    sold: 0,
    total: 9
  },
  {
    id: "15",
    name: "Máy hút bụi Electrolux 2000W",
    image: "/placeholder-vacuum.png",
    specs: ["2000W", "Khô/ướt", "Túi lọc", "Đa năng"],
    currentPrice: 2490000,
    originalPrice: 3790000,
    sold: 0,
    total: 12
  }
];

export function FlashSaleBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(6);
  const [isVertical, setIsVertical] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 1,
    minutes: 23,
    seconds: 45
  });

  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth <= 760) {
        setSlidesPerView(1);
        setIsVertical(true);
      } else if (windowWidth <= 1024) {
        setSlidesPerView(4);
        setIsVertical(false);
      } else {
        setSlidesPerView(6);
        setIsVertical(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 }; // Reset to next day
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prev) => {
      const newIndex = (prev + 1) % flashSaleProducts.length;
      
      // Reset position sau khi transition hoàn thành
      setTimeout(() => {
        if (newIndex === 0) {
          setCurrentIndex(0);
        }
        setIsTransitioning(false);
      }, 500);
      
      return newIndex;
    });
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prev) => {
      const newIndex = prev === 0 ? flashSaleProducts.length - 1 : prev - 1;
      
      // Reset position sau khi transition hoàn thành
      setTimeout(() => {
        if (newIndex === flashSaleProducts.length - 1) {
          setCurrentIndex(flashSaleProducts.length - 1);
        }
        setIsTransitioning(false);
      }, 500);
      
      return newIndex;
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const getVisibleProducts = () => {
    const products = [];
    // Thêm sản phẩm trước để tạo infinite loop
    for (let i = -1; i < slidesPerView + 1; i++) {
      const index = (currentIndex + i + flashSaleProducts.length) % flashSaleProducts.length;
      products.push(flashSaleProducts[index]);
    }
    return products;
  };

  const visibleProducts = getVisibleProducts();

  return (
    <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 mx-4 my-6 shadow-2xl w-full">
      {/* Header */}
      <div className="bg-red-600 text-white px-4 py-2 rounded-t-lg mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            <span className="font-bold text-lg">FLASH SALE HỌC SINH - SINH VIÊN</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <div>9h - 11h 23/09</div>
              <div>9h - 11h 24/09</div>
            </div>
            <div className="text-right">
              <div className="text-xs">BẮT ĐẦU SAU:</div>
              <div className="font-mono text-lg font-bold">
                {String(timeLeft.hours).padStart(2, '0')} : {String(timeLeft.minutes).padStart(2, '0')} : {String(timeLeft.seconds).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>
      </div>

       {/* Products Carousel */}
       <div className={`relative w-full overflow-hidden ${isVertical ? 'h-96' : 'h-auto'}`}>
         <div 
           className={`flex gap-3 ${
             isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''
           } ${isVertical ? 'flex-col' : 'flex-row'}`}
           style={{ 
             transform: isVertical 
               ? `translateY(-${(currentIndex + 1) * (320 + 12)}px)`
               : `translateX(-${(currentIndex + 1) * (240 + 12)}px)`,
             width: isVertical ? '100%' : `${(slidesPerView + 2) * (240 + 12)}px`,
             height: isVertical ? `${(flashSaleProducts.length + 2) * (320 + 12)}px` : 'auto'
           }}
         >
          {visibleProducts.map((product) => (
            <div key={product.id} className={`flex-shrink-0 bg-white rounded-xl p-3 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out border border-gray-100 ${
              isVertical ? 'w-full h-80' : 'w-60'
            }`}>
              {/* Product Image */}
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                <div className="text-gray-400 text-center">
                  <div className="text-5xl mb-2 opacity-60">📱</div>
                  <div className="text-xs font-medium">Hình ảnh sản phẩm</div>
                </div>
                {/* Flash Sale Badge */}
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  FLASH SALE
                </div>
              </div>
              
               {/* Product Name */}
               <h3 className="font-bold text-sm mb-2 line-clamp-2 text-gray-800 leading-tight">{product.name}</h3>
              
              {/* Specifications */}
              <div className="space-y-1 mb-4">
                {product.specs.map((spec, index) => (
                  <div key={index} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-md inline-block mr-1 mb-1">
                    {spec}
                  </div>
                ))}
              </div>
              
              {/* Price Section */}
              <div className="mb-3">
                <div className="flex items-center gap-1 mb-1">
                  <div className="text-red-600 font-bold text-lg">{formatPrice(product.currentPrice)}₫</div>
                  <div className="bg-red-100 text-red-600 text-xs px-1 py-0.5 rounded-full font-semibold">
                    -{Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100)}%
                  </div>
                </div>
                <div className="text-gray-400 text-xs line-through">{formatPrice(product.originalPrice)}₫</div>
              </div>
              
              {/* Progress Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 font-medium">Đã bán {product.sold}/{product.total} suất</span>
                  <span className="text-gray-500">{Math.round((product.sold / product.total) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-500 ease-out"
                    style={{ width: `${(product.sold / product.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        {flashSaleProducts.length > slidesPerView && (
          <>
            <button
              onClick={prevSlide}
              className={`absolute w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 hover:scale-110 transition-all duration-300 ease-in-out z-10 ${
                isVertical 
                  ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-4' 
                  : 'left-0 top-1/2 -translate-y-1/2 -translate-x-4'
              }`}
            >
              <ChevronLeft className={`h-5 w-5 text-gray-600 ${isVertical ? 'rotate-90' : ''}`} />
            </button>
            <button
              onClick={nextSlide}
              className={`absolute w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 hover:scale-110 transition-all duration-300 ease-in-out z-10 ${
                isVertical 
                  ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-4' 
                  : 'right-0 top-1/2 -translate-y-1/2 translate-x-4'
              }`}
            >
              <ChevronRight className={`h-5 w-5 text-gray-600 ${isVertical ? 'rotate-90' : ''}`} />
            </button>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 text-center">
        <p className="text-xs text-white/90 mb-2">
          Chỉ áp dụng thanh toán online thành công – Mỗi SĐT chỉ được mua 1 sản phẩm cùng loại
        </p>
        {/* <div className="flex justify-end gap-2">
          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
            Lên đầu ↑
          </Button>
          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
            Liên hệ 🎧
          </Button>
        </div> */}
      </div>
    </div>
  );
}
