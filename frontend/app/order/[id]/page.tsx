"use client";

import OrderDetails from "@/components/order-details/OrderDetails";
import Header from "@/components/header/Header";
import React, { useEffect } from "react";
import { useAppContext } from "@/app/contexts/AppContext";

const Order = ({ params }: { params: { id: string } }) => {
  const { loading, fetchOrder, order } = useAppContext();

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
      ) : (
        order && <OrderDetails order={order!} />
      )}
    </div>
  );
};

export default Order;
