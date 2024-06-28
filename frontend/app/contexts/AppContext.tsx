import { PurchaseOrder } from "@/types";
import axios from "axios";
import React, {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface Props {
  orders: PurchaseOrder[];
  order: PurchaseOrder;
  loading: string | null;
  setLoading: Dispatch<SetStateAction<string | null>>;
  fetchOrders: () => Promise<void>;
  fetchOrder: (id: string) => Promise<void>;
  totalPages: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}

const Context = createContext<Props | null>(null);

const AppContext: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [order, setOrder] = useState<PurchaseOrder | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);

  //   Fetch orders
  const fetchOrders = async () => {
    setLoading("fetch-orders");
    try {
      const { data } = await axios.get(`/api/orders`);
      console.log(data?.data);
      setTotalPages(data?.data?.pages);
      setOrders(data?.data?.orders as PurchaseOrder[]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(null);
    }
  };

  //   Fetch order
  const fetchOrder = async (id: string) => {
    setLoading("fetch-order");
    try {
      const { data } = await axios.get(`/api/order/${id}?page=${page}`);
      console.log(data?.data?.data);
      setOrder(data?.data?.data as PurchaseOrder);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <Context.Provider
      value={{
        loading,
        orders,
        setLoading,
        fetchOrders,
        fetchOrder,
        order: order!,
        totalPages,
        page,
        setPage,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(Context);

  return context as Props;
};

export default AppContext