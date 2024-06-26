import { Request, Response } from "express";
import { purchaseOrdersResponse } from "../utils/generateOrders";
import { OrderItem, PurchaseOrder } from "../types";

interface PaginatedProducts {
  orders: PurchaseOrder[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export const getOrders = (req: Request, res: Response) => {
  try {
    // Get page number and product number from user
    const { page = 1, limit = 10 } = req.query;

    // Check if page and limit are in query
    if (!page) {
      return res.status(400).json({ message: "Page query is missing" });
    }

    if (!limit) {
      return res.status(400).json({ message: "Limit query is missing" });
    }

    // Paginate orders
    let slicedOrders = purchaseOrdersResponse.orders.slice(
      Number(page),
      Number(limit)
    );
    let totalOrders = purchaseOrdersResponse.orders.length;

    const orders: PaginatedProducts = {
      orders: slicedOrders,
      total: purchaseOrdersResponse.orders.length,
      limit: Number(limit),
      page: Number(page),
      pages: Math.ceil(totalOrders / parseInt(limit as string, 10)),
    };

    res.json({ data: orders });
  } catch (error) {
    return res.json({ error })
  }
};

export const createOrder = (req: Request<{},{}, Omit<PurchaseOrder, "id">>, res: Response) => {
  try {
    const { supplier, orderDate, items, totalAmount, status, deliveryDate, notes, createdBy, approvedBy, currency, paymentTerms } = req.body;

    if (!supplier || !orderDate || !items || !totalAmount || !status || !createdBy || !currency || !paymentTerms) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newOrder: PurchaseOrder = {
      id: purchaseOrdersResponse.orders.length + 1, // Generate a new ID
      supplier,
      orderDate,
      items: items.map((item: OrderItem) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        unit: item.unit,
        discount: item.discount,
        totalPrice: item.totalPrice,
      })),
      totalAmount,
      status,
      createdBy,
      currency,
      paymentTerms,
      deliveryDate,
      notes,
      approvedBy,
    };

    purchaseOrdersResponse.orders.push(newOrder);
    const totalOrders = purchaseOrdersResponse.orders.length;

    return res.status(201).json({ data: newOrder, message: "Order created successfully!" });
  } catch (error) {
    console.log("error", error)
    return res.status(500).json({ error });
  }
};