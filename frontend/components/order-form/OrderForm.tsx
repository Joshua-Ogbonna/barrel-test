"use client";

import React, { useEffect, useState } from "react";
import styles from "./OrderForm.module.css";
import { PurchaseOrder, OrderItem } from "@/types";
import axios from "axios";
import { useAppContext } from "@/app/contexts/AppContext";
import { useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";

const OrderForm: React.FC = () => {
  const { loading, setLoading, fetchOrder, order: editOrder } = useAppContext();
  const [order, setOrder] = useState<Omit<PurchaseOrder, "id">>({
    supplier: "",
    orderDate: "",
    items: [
      {
        productId: 0,
        productName: "",
        quantity: 0,
        price: 0,
        unit: "",
        discount: 0,
        totalPrice: 0,
      },
    ],
    totalAmount: 0,
    status: "Pending",
    createdBy: "",
    currency: "",
    paymentTerms: "",
  });
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const edit = searchParams.get("edit");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setOrder({
      ...order,
      [name]: value,
    });
  };

  const handleItemChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const items = [...order.items];
    items[index] = { ...items[index], [name]: value };
    setOrder({
      ...order,
      items,
    });
  };

  const addItem = () => {
    setOrder({
      ...order,
      items: [
        ...order.items,
        {
          productId: 0,
          productName: "",
          quantity: 0,
          price: 0,
          unit: "",
          discount: 0,
          totalPrice: 0,
        },
      ],
    });
  };

  const removeItem = (index: number) => {
    if (order.items.length === 1) return;

    const items = order.items.filter((_, i) => i !== index);
    setOrder({
      ...order,
      items,
    });
  };

  const handleEditOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading("edit-order");

    try {
      const { data } = await axios.put(
        `/api/order/${editOrder.id}`,
        JSON.stringify(order),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data?.data?.message);
      alert(data?.data?.message);
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading("new-order");

    try {
      const { data } = await axios.post(
        `/api/order/new`,
        JSON.stringify(order),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data?.data?.message);
      alert(data?.data?.message);
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(null);
    }
  };

  useEffect(() => {
    if (id !== "" && id !== null && edit === "true") {
      fetchOrder(id);
    }
  }, [id, edit]);

  useEffect(() => {
    if (editOrder) {
      setOrder({
        ...editOrder,
        orderDate: dayjs(editOrder.orderDate).format("YYYY-MM-DD"),
      });
    }
  }, [editOrder]);

  return (
    <div className={styles.order__form}>
      <h2>Create Order</h2>
      <form onSubmit={edit === "true" ? handleEditOrder : handleSubmit}>
        <label>Supplier</label>
        <input
          type="text"
          name="supplier"
          value={order.supplier}
          onChange={handleChange}
          required
        />

        <label>Order Date</label>
        <input
          type="date"
          name="orderDate"
          value={order.orderDate}
          onChange={handleChange}
          required
        />

        <div className={styles.items}>
          {order.items.map((item, index) => (
            <div key={index} className={styles.item}>
              <label>Product ID</label>
              <input
                type="number"
                name="productId"
                value={order.items.length + 1}
                disabled
              />

              <label>Product Name</label>
              <input
                type="text"
                name="productName"
                value={item.productName}
                onChange={(e) => handleItemChange(index, e)}
                required
              />

              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, e)}
                required
              />

              <label>Price</label>
              <input
                type="number"
                name="price"
                value={item.price}
                onChange={(e) => handleItemChange(index, e)}
                required
              />

              <label>Unit</label>
              <input
                type="text"
                name="unit"
                value={item.unit}
                onChange={(e) => handleItemChange(index, e)}
                required
              />

              <label>Discount</label>
              <input
                type="number"
                name="discount"
                value={item.discount}
                onChange={(e) => handleItemChange(index, e)}
              />

              <label>Total Price</label>
              <input
                type="number"
                name="totalPrice"
                value={item.price * item.quantity}
                onChange={(e) => handleItemChange(index, e)}
                disabled
              />

              <button type="button" onClick={() => removeItem(index)}>
                Remove Item
              </button>
            </div>
          ))}
        </div>

        <button type="button" onClick={addItem}>
          Add Item
        </button>

        <label>Total Amount</label>
        <input
          type="number"
          name="totalAmount"
          value={order.totalAmount}
          onChange={handleChange}
          required
        />

        <label>Status</label>
        {/* <input
          type="text"
          name="status"
          value={order.status}
          onChange={handleChange}
        /> */}
        <select name="status" value={order.status} onChange={handleChange}>
          <option value={order.status}>{order.status} </option>
          {["Pending", "Completed", "Cancelled"]
            .filter((status) => status !== order.status)
            .map((status) => (
              <option key={status}>{status}</option>
            ))}
        </select>

        <label>Delivery Date</label>
        <input
          type="date"
          name="deliveryDate"
          value={order.deliveryDate}
          onChange={handleChange}
          required
        />

        <label>Notes</label>
        <textarea
          name="notes"
          value={order.notes}
          onChange={handleChange}
        ></textarea>

        <label>Created By</label>
        <input
          type="text"
          name="createdBy"
          value={order.createdBy}
          onChange={handleChange}
          required
        />

        <label>Approved By</label>
        <input
          type="text"
          name="approvedBy"
          value={order.approvedBy}
          onChange={handleChange}
          required
        />

        <label>Currency</label>
        <input
          type="text"
          name="currency"
          value={order.currency}
          onChange={handleChange}
          required
        />

        <label>Payment Terms</label>
        <input
          type="text"
          name="paymentTerms"
          value={order.paymentTerms}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {loading === "new-order" || loading === "edit-order"
            ? "..."
            : "Create Order"}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
