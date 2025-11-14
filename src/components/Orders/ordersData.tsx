import type { Order } from "@/types/order";

const ordersData: Order[] = [
  {
    orderId: "234c56",
    createdAt: "18th May, 2022",
    status: "delivered" as const,
    total: "$100",
    title: "Sunglasses",
  },
  {
    orderId: "234c56",
    createdAt: "18th May, 2022",
    status: "processing" as const,
    total: "$100",
    title: "Watchs",
  },
  {
    orderId: "234c56",
    createdAt: "18th May, 2022",
    status: "delivered" as const,
    total: "$100",
    title: "Cancelled",
  }
];

export default ordersData;
