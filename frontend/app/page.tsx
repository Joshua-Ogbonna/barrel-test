"use client";

import styles from "./page.module.css";
import { BiPlus } from "react-icons/bi";
import OrderList from "@/components/order-list/OrderList";
import { useRouter } from "next/navigation";
import Header from "@/components/header/Header";
import { useAppContext } from "./contexts/AppContext";
import { useEffect } from "react";
import Pagination from "@/components/pagination/Pagination";

export default function Home() {
  const router = useRouter();
  const { loading, orders, fetchOrders, page } = useAppContext();

  useEffect(() => {
    fetchOrders();
  }, [page]);

  return (
    <main className={styles.main}>
      <Header />

      {/* Order Body */}
      <div className={styles.orders__layout}>
        {/* Action Buttons */}
        <div className={styles.actions}>
          <button
            className={styles.new__order}
            onClick={() => router.push(`/order/new`)}
          >
            {" "}
            <BiPlus /> New order
          </button>
        </div>

        {/* Order list */}
        {loading === "fetch-orders" ? (
          <div>Fetching orders...</div>
        ) : orders.length ? (
          <>
            <OrderList orders={orders} />
            <Pagination />
          </>
        ) : (
          <div>No orders available</div>
        )}
      </div>
    </main>
  );
}
