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
        <label htmlFor="supplier">Supplier</label>
        <input
          type="text"
          name="supplier"
          id="supplier"
          value={order.supplier}
          onChange={handleChange}
          required
        />

        <label htmlFor="orderDate">Order Date</label>
        <input
          type="date"
          name="orderDate"
          id="orderDate"
          value={order.orderDate}
          onChange={handleChange}
          required
        />

        <div className={styles.items}>
          {order.items.map((item, index) => (
            <div key={index} className={styles.item}>
              <label htmlFor={`productId-${index}`}>Product ID</label>
              <input
                type="number"
                name="productId"
                id={`productId-${index}`}
                value={item.productId}
                disabled
              />

              <label htmlFor={`productName-${index}`}>Product Name</label>
              <input
                type="text"
                id={`productName-${index}`}
                name="productName"
                value={item.productName}
                onChange={(e) => handleItemChange(index, e)}
                required
              />

              <label htmlFor={`quantity-${index}`}>Quantity</label>
              <input
                type="number"
                name="quantity"
                id={`quantity-${index}`}
                value={item.quantity}
                onChange={(e) => handleItemChange(index, e)}
                required
              />

              <label htmlFor={`price-${index}`}>Price</label>
              <input
                type="number"
                name="price"
                id={`price-${index}`}
                value={item.price}
                onChange={(e) => handleItemChange(index, e)}
                required
              />

              <label htmlFor={`unit-${index}`}>Unit</label>
              <input
                type="text"
                name="unit"
                id={`unit-${index}`}
                value={item.unit}
                onChange={(e) => handleItemChange(index, e)}
                required
              />

              <label htmlFor={`discount-${index}`}>Discount</label>
              <input
                type="number"
                name="discount"
                id={`discount-${index}`}
                value={item.discount}
                onChange={(e) => handleItemChange(index, e)}
              />

              <label htmlFor={`totalPrice-${index}`}>Total Price</label>
              <input
                type="number"
                name="totalPrice"
                id={`totalPrice-${index}`}
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

        <label htmlFor="totalAmount">Total Amount</label>
        <input
          type="number"
          id="totalAmount"
          name="totalAmount"
          value={order.totalAmount}
          onChange={handleChange}
          required
        />

        <label htmlFor="status">Status</label>
        {/* <input
          type="text"
          name="status"
          value={order.status}
          onChange={handleChange}
        /> */}
        <select
          name="status"
          id="status"
          value={order.status}
          onChange={handleChange}
        >
          <option value={order.status}>{order.status} </option>
          {["Pending", "Completed", "Cancelled"]
            .filter((status) => status !== order.status)
            .map((status) => (
              <option key={status}>{status}</option>
            ))}
        </select>

        <label htmlFor="deliveryDate">Delivery Date</label>
        <input
          type="date"
          name="deliveryDate"
          id="deliveryDate"
          value={order.deliveryDate}
          onChange={handleChange}
          required
        />

        <label htmlFor="notes">Notes</label>
        <textarea
          name="notes"
          id="notes"
          value={order.notes}
          onChange={handleChange}
        ></textarea>

        <label htmlFor="createdBy">Created By</label>
        <input
          type="text"
          id="createdBy"
          name="createdBy"
          value={order.createdBy}
          onChange={handleChange}
          required
        />

        <label htmlFor="approvedBy">Approved By</label>
        <input
          type="text"
          id="approvedBy"
          name="approvedBy"
          value={order.approvedBy}
          onChange={handleChange}
          required
        />

        <label htmlFor="currency">Currency</label>
        <input
          type="text"
          id="currency"
          name="currency"
          value={order.currency}
          onChange={handleChange}
          required
        />

        <label htmlFor="paymentTerms">Payment Terms</label>
        <input
          type="text"
          id="paymentTerms"
          name="paymentTerms"
          value={order.paymentTerms}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {loading === "new-order" || loading === "edit-order"
            ? "..."
            : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
