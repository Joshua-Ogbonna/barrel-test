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
  requestState: "error" | "success" | null;
  message: string;
}

const Context = createContext<Props | null>(null);

const AppContext: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [order, setOrder] = useState<PurchaseOrder | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [requestState, setRequestState] = useState<"error" | "success" | null>(
    null
  );
  const [message, setMessage] = useState("");

  //   Fetch orders
  const fetchOrders = async () => {
    setLoading("fetch-orders");
    setRequestState(null);
    setMessage("");
    try {
      const { data } = await axios.get(`/api/orders`);
      console.log(data?.data);
      setTotalPages(data?.data?.pages);
      setOrders(data?.data?.orders as PurchaseOrder[]);
      setRequestState("success");
      setMessage("Success");
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
        setRequestState("error");
      }
    } finally {
      setLoading(null);
    }
  };

  //   Fetch order
  const fetchOrder = async (id: string) => {
    setLoading("fetch-order");
    setRequestState(null);
    setMessage("");
    try {
      const { data } = await axios.get(`/api/order/${id}?page=${page}`);
      console.log(data?.data?.data);
      setOrder(data?.data?.data as PurchaseOrder);
      setRequestState("success");
      setMessage(data?.data?.message);
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
        setRequestState("error");
      }
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
        requestState,
        message
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

export default AppContext;
