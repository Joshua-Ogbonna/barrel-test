"use client";

import React, { FC } from "react";
import styles from "./OrderList.module.css";
import { PurchaseOrder } from "@/types";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

interface Props {
  orders: PurchaseOrder[];
}

const OrderList: FC<Props> = ({ orders }) => {
  const router = useRouter();
  return (
    <div className={styles.order__list}>
      <div className={styles.table__container}>
        <table className={styles.table}>
          <thead>
            <tr>
              {["Order #", "Supplier", "Order Date", "Amount", "Status", ""].map(
                (head, idx) => (
                  <td key={idx} className={styles.head}>
                    {head}
                  </td>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className={styles.body}>
                <td> #{order.id} </td>
                <td> {order.supplier} </td>
                <td> {dayjs(order.orderDate).format("DD/MM/YYYY")} </td>
                <td> {order.totalAmount.toLocaleString()} </td>
                <td> {order.status} </td>
                <td>
                  <button
                    className={styles.view}
                    onClick={() => router.push(`/order/${order.id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
