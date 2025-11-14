import React, { useState } from "react";

const Discount = () => {
  const [couponCode, setCouponCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement coupon code validation
    if (couponCode.trim()) {
      alert(`Mã giảm giá "${couponCode}" đã được áp dụng!`);
      setCouponCode("");
    }
  };

  return (
    <div className="lg:max-w-[670px] w-full">
      <form onSubmit={handleSubmit}>
        {/* <!-- coupon box --> */}
        <div className="bg-white shadow-1 rounded-xl">
          <div className="border-b border-gray-3 py-5 px-4 sm:px-5.5">
            <h3 className="font-medium text-dark">Bạn có mã giảm giá?</h3>
          </div>

          <div className="py-8 px-4 sm:px-8.5">
            <div className="flex flex-wrap gap-4 xl:gap-5.5">
              <div className="max-w-[426px] w-full flex-1">
                <input
                  type="text"
                  name="coupon"
                  id="coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Nhập mã giảm giá"
                  className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-blue focus:shadow-input focus:ring-2 focus:ring-blue/20"
                />
              </div>

              <button
                type="submit"
                className="inline-flex font-medium text-white bg-blue py-3 px-8 rounded-md ease-out duration-200 hover:bg-blue-dark"
              >
                Áp dụng mã
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Discount;
