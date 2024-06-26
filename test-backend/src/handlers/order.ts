import { Request, Response, Router } from "express";
import { purchaseOrdersResponse } from "../utils/generateOrders";
import { PurchaseOrder, OrderItem } from "../types";

const router = Router();

interface Props {
  id: string;
}

export const getOrder = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id);

    const order = purchaseOrdersResponse.orders.find(
      (order) => order.id === Number(id)
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json({ data: order, message: "Order found!" });
  } catch (error) {
    return res.json({ error });
  }
};

export const editOrder = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      supplier,
      orderDate,
      items,
      totalAmount,
      status,
      deliveryDate,
      notes,
      createdBy,
      approvedBy,
      currency,
      paymentTerms,
    } = req.body;

    const orderIndex = purchaseOrdersResponse.orders.findIndex(
      (order) => order.id === Number(id)
    );

    if (orderIndex === -1) {
      return res.status(404).json({ message: "Order not found" });
    }

    let orderToEdit = purchaseOrdersResponse.orders[orderIndex];

    const updatedOrder: PurchaseOrder = {
      ...orderToEdit,
      supplier: supplier ?? orderToEdit.supplier,
      orderDate: orderDate ?? orderToEdit.orderDate,
      items: items ?? orderToEdit.items,
      totalAmount: totalAmount ?? orderToEdit.totalAmount,
      status: status ?? orderToEdit.status,
      deliveryDate: deliveryDate ?? orderToEdit.deliveryDate,
      notes: notes ?? orderToEdit.notes,
      createdBy: createdBy ?? orderToEdit.createdBy,
      approvedBy: approvedBy ?? orderToEdit.approvedBy,
      currency: currency ?? orderToEdit.currency,
      paymentTerms: paymentTerms ?? orderToEdit.paymentTerms,
    };

    orderToEdit = updatedOrder;

    return res
      .status(200)
      .json({ data: updatedOrder, message: "Order updated successfully!" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const deleteOrder = (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedOrder = purchaseOrdersResponse.orders.filter(
      (order) => order.id !== Number(id)
    );

    return res
      .status(200)
      .json({ data: deletedOrder, message: "Order deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default router;
