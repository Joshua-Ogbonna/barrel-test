"use client";

import OrderDetails from "@/components/order-details/OrderDetails";
import Header from "@/components/header/Header";
import React, { useEffect } from "react";
import { useAppContext } from "@/app/contexts/AppContext";

const Order = ({ params }: { params: { id: string } }) => {
  const { loading, fetchOrder, order, requestState, message } = useAppContext();

  useEffect(() => {
    if (params.id) {
      fetchOrder(params.id);
    }
  }, [params.id]);

  return (
    <div>
      <Header />
      {loading === "fetch-order" ? (
        <div>Fetching order ...</div>
      ) : requestState === "error" ? (
        <div>Error fetching order. Please try again </div>
      ) : (
        order && <OrderDetails order={order!} />
      )}
    </div>
  );
};

export default Order;
