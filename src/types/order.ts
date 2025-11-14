export interface Order {
  orderId: string;
  createdAt: string;
  status: "delivered" | "processing" | "on-hold" | "cancelled";
  total: string;
  title: string;
}

export interface EditOrderProps {
  order: Order;
  toggleModal: (status: boolean) => void;
}

export interface OrderActionsProps {
  toggleEdit: () => void;
  toggleDetails: () => void;
}

export interface OrderDetailsProps {
  orderItem: Order;
}

export interface OrderModalProps {
  showDetails: boolean;
  showEdit: boolean;
  toggleModal: (status: boolean) => void;
  order: Order;
}

export interface SingleOrderProps {
  orderItem: Order;
  smallView: boolean;
}





