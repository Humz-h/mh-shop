import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useAppSelector } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

const OrderSummary = () => {
  const router = useRouter();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className="lg:max-w-[455px] w-full">
      {/* <!-- order list box --> */}
      <div className="bg-white shadow-1 rounded-xl">
        <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
          <h3 className="font-medium text-xl text-dark">Tóm tắt đơn hàng</h3>
        </div>

        <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
          {/* <!-- title --> */}
          <div className="flex items-center justify-between py-5 border-b border-gray-3">
            <div>
              <h4 className="font-medium text-dark">Sản phẩm</h4>
            </div>
            <div>
              <h4 className="font-medium text-dark text-right">Tổng tiền</h4>
            </div>
          </div>

          {/* <!-- product item --> */}
          {cartItems.map((item, key) => (
            <div key={key} className="flex items-center justify-between py-5 border-b border-gray-3">
              <div className="flex-1">
                <p className="text-dark text-sm">{item.title}</p>
                <p className="text-dark-4 text-xs mt-1">Số lượng: {item.quantity}</p>
              </div>
              <div>
                <p className="text-dark text-right font-medium">
                  {formatCurrency(item.discountedPrice * item.quantity, "VND")}
                </p>
              </div>
            </div>
          ))}

          {/* <!-- total --> */}
          <div className="flex items-center justify-between pt-5 border-t border-gray-3 mt-5">
            <div>
              <p className="font-semibold text-lg text-dark">Tổng cộng</p>
            </div>
            <div>
              <p className="font-semibold text-lg text-blue text-right">
                {formatCurrency(totalPrice, "VND")}
              </p>
            </div>
          </div>

          {/* <!-- checkout button --> */}
          <button
            type="button"
            onClick={handleCheckout}
            className="w-full flex justify-center font-medium text-dark bg-blue border-2 border-blue py-4 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark hover:border-blue-dark mt-7.5 text-lg"
          >
            Thanh toán
          </button>

          <Link
            href="/shop-with-sidebar"
            className="w-full flex justify-center font-medium text-dark border border-gray-3 bg-white py-3 px-6 rounded-md ease-out duration-200 hover:bg-gray-1 hover:border-blue mt-3"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
