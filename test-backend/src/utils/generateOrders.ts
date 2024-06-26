import { PurchaseOrder, OrderItem, PurchaseOrdersResponse } from "../types";

const samplePurchaseOrders: PurchaseOrder[] = [];

for (let i = 1; i <= 50; i++) {
  const orderItems: OrderItem[] = [
    {
      productId: i,
      productName: `Product ${i}`,
      quantity: Math.floor(Math.random() * 100) + 1,
      price: parseFloat((Math.random() * 100).toFixed(2)),
      unit: 'pcs',
      discount: parseFloat((Math.random() * 10).toFixed(2)),
      totalPrice: parseFloat(((Math.random() * 100) * (Math.random() * 100) - (Math.random() * 10)).toFixed(2)),
    },
    {
      productId: i + 1,
      productName: `Product ${i + 1}`,
      quantity: Math.floor(Math.random() * 100) + 1,
      price: parseFloat((Math.random() * 100).toFixed(2)),
      unit: 'kg',
      totalPrice: parseFloat(((Math.random() * 100) * (Math.random() * 100) - (Math.random() * 10)).toFixed(2)),
    },
  ];

  const purchaseOrder: PurchaseOrder = {
    id: i,
    supplier: `Supplier ${Math.floor(Math.random() * 10) + 1}`,
    orderDate: new Date().toISOString(),
    items: orderItems,
    totalAmount: orderItems.reduce((acc, item) => acc + item.totalPrice, 0),
    status: ['Pending', 'Completed', 'Cancelled'][Math.floor(Math.random() * 3)] as 'Pending' | 'Completed' | 'Cancelled',
    createdBy: `User ${Math.floor(Math.random() * 5) + 1}`,
    currency: 'USD',
    paymentTerms: 'Net 30',
  };

  if (Math.random() > 0.5) {
    purchaseOrder.deliveryDate = new Date(new Date().getTime() + Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString();
  }

  if (Math.random() > 0.5) {
    purchaseOrder.notes = `Special note for order ${i}`;
  }

  if (Math.random() > 0.5) {
    purchaseOrder.approvedBy = `User ${Math.floor(Math.random() * 5) + 1}`;
  }

  samplePurchaseOrders.push(purchaseOrder);
}

const purchaseOrdersResponse: PurchaseOrdersResponse = {
  orders: samplePurchaseOrders,
};

export { purchaseOrdersResponse };
