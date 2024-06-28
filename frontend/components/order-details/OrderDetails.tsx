import React, { FC } from "react";
import styles from "./OrderDetails.module.css";
import dayjs from "dayjs";
import { PurchaseOrder } from "@/types";
import { useAppContext } from "@/app/contexts/AppContext";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Props {
  order: PurchaseOrder;
}

const OrderDetails: FC<Props> = ({ order }) => {
  const { setLoading, loading } = useAppContext();
  const router = useRouter();

  const handleDelete = async () => {
    setLoading("delete-order");
    try {
      const { data } = await axios.delete(`/api/order/${order.id}`);
      console.log(data);
      alert(data?.data?.message);
      router.back();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className={styles.order__details}>
      {/* Order Number */}
      <h1 className={styles.order__no}>Order no: {order.id} </h1>

      {/* Section (Order Info) */}
      <section className={styles.order__info}>
        <h3 className={styles.header}> Order Info </h3>

        {/* Deets */}
        <div>
          {[
            {
              orderDate: dayjs(order.orderDate).format("MM/DD/YYYY"),
              status: order.status,
              amount: order.totalAmount.toLocaleString(),
              supplier: order.supplier,
              approvedBy: order!.approvedBy,
            },
          ].map((deet, idx) => (
            <div key={idx}>
              <Deet deetName="Order Date" deetValue={deet.orderDate} />
              <Deet deetName="Status" deetValue={deet.status} />
              <Deet deetName="Amount" deetValue={deet.amount} />
              <Deet deetName="Supplier" deetValue={deet.supplier} />
              <Deet
                deetName="Approved By"
                deetValue={deet!.approvedBy as string}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Section (Order products) */}
      <section className={styles.order__info}>
        <h3 className={styles.header}>Products ({order.items.length}) </h3>

        {/* Section (Deets) */}
        <div className={styles.table__container}>
          {/* Table */}
          <table className={styles.items__table}>
            <thead>
              <tr className={styles.row}>
                {[
                  "Product ID",
                  "Product Name",
                  "Quantity",
                  "Discount",
                  "Price",
                  "Total price",
                ].map((head) => (
                  <td key={head} className={styles.head}>
                    {head}{" "}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {order.items.map((order) => (
                <tr key={order.productId} className={styles.data}>
                  <td>{order.productId} </td>
                  <td>{order.productName} </td>
                  <td>{order.quantity} </td>
                  <td>{order?.discount ?? 0} </td>
                  <td>{order.price.toLocaleString()} </td>
                  <td> {order.totalPrice.toLocaleString()} </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section (Order Notes) */}
      <section className={styles.order__info}>
        <h3 className={styles.header}>Order Notes</h3>

        <div className={styles.order__notes}>
          {order.notes ?? "No notes available for this order"}
        </div>
      </section>

      {/* Section (Action buttons) */}
      <section className={styles.order__info}>
        <div className={styles.order__actions}>
          <button
            className={styles.btn}
            onClick={() => router.push(`/order/new?edit=true&id=${order.id}`)}
          >
            Edit Order
          </button>
          <button className={styles.btn} onClick={handleDelete}>
            {loading === "delete-order" ? "Deleting ..." : "Delete Order"}
          </button>
        </div>
      </section>
    </div>
  );
};

interface DeetProps {
  deetName: string;
  deetValue: string;
}

export const Deet: FC<DeetProps> = ({ deetName, deetValue }) => {
  return (
    <div className={styles.deet}>
      <h5 className={styles.name}>{deetName}</h5>
      <p className={styles.value}>{deetValue} </p>
    </div>
  );
};

export default OrderDetails;
