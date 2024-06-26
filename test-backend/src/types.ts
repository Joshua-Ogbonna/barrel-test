interface PurchaseOrder {
  id: number;
  supplier: string;
  orderDate: string; // ISO 8601 format (e.g., "2024-06-25")
  items: OrderItem[];
  totalAmount: number;
  status: "Pending" | "Completed" | "Cancelled";
  deliveryDate?: string; // Optional property, ISO 8601 format
  notes?: string; // Optional property for additional notes
  createdBy: string; // User who created the order
  approvedBy?: string; // User who approved the order
  currency: string; // Currency code (e.g., "USD")
  paymentTerms: string; // Description of payment terms
}

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  unit: string; // Unit of measurement (e.g., "pcs", "kg")
  discount?: number; // Optional property for discount
  totalPrice: number; // Total price for the item (quantity * price - discount)
}

interface PurchaseOrdersResponse {
  orders: PurchaseOrder[];
}

interface PaginatedProducts {
  orders: PurchaseOrder[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export {
  PurchaseOrder,
  OrderItem,
  PurchaseOrdersResponse,
  PaginatedProducts
}
