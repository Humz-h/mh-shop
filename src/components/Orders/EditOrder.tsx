import React, { useState, ChangeEvent, MouseEvent } from "react";
import toast from "react-hot-toast";
import { EditOrderProps } from "@/types/order";

const EditOrder = ({ order, toggleModal }: EditOrderProps) => {
  const [currentStatus, setCurrentStatus] = useState<"delivered" | "processing" | "on-hold" | "cancelled">(order?.status || "processing");
  const handleChanege = (e: ChangeEvent<HTMLSelectElement>) => {
    setCurrentStatus(e.target.value as "delivered" | "processing" | "on-hold" | "cancelled");
  };

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!currentStatus) {
      toast.error("Please select a status");
      return;
    }

    toggleModal(false);
  };

  return (
    <div className="w-full px-10">
      <p className="pb-2 font-medium text-dark">Order Status</p>
      <div className="w-full">
        <select
          className="w-full rounded-[10px] border border-gray-3 bg-gray-1 text-dark py-3.5 px-5 text-custom-sm"
          name="status"
          id="status"
          required
          onChange={handleChanege}
        >
          <option value="processing">Processing</option>
          <option value="on-hold">On Hold</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button
          className="mt-5 w-full rounded-[10px] border border-blue-1 bg-blue-1 text-white py-3.5 px-5 text-custom-sm bg-blue"
          onClick={handleSubmit}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditOrder;
