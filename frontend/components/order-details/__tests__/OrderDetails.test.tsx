import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import OrderDetails from "../OrderDetails";
import AppContext from "@/app/contexts/AppContext";
import { PurchaseOrder } from "@/types";
import axios from "axios";

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

// Mock axios
jest.mock("axios");

// Mock window.alert
window.alert = jest.fn();

// Mock loading
const mockSetLoading = jest.fn();
const mockContextValue = {
  setLoading: mockSetLoading,
  loading: null,
  // ... other required context values
};

// Mock order data
const mockOrder: PurchaseOrder = {
  id: 12345,
  orderDate: "2024-06-28",
  status: "Pending",
  totalAmount: 1000,
  supplier: "Test Supplier",
  approvedBy: "John Doe",
  items: [
    {
      productId: 1,
      productName: "Test Product",
      quantity: 2,
      price: 500,
      totalPrice: 1000,
      unit: "km",
    },
  ],
  notes: "Test notes",
  createdBy: "Jovish",
  currency: "USD",
  paymentTerms: "",
};

// Wrap the component with the context provider
const renderWithContext = (ui: React.ReactElement) => {
  return render(<AppContext>{ui}</AppContext>);
};

describe("OrderDetails", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders order details correctly", () => {
    renderWithContext(<OrderDetails order={mockOrder} />);

    expect(screen.getByText(`Order no: ${mockOrder.id}`)).toBeInTheDocument();
    expect(screen.getByText("Order Info")).toBeInTheDocument();
    expect(screen.getByText("Products (1)")).toBeInTheDocument();
    expect(screen.getByText("Order Notes")).toBeInTheDocument();
    expect(screen.getByText(mockOrder.notes!)).toBeInTheDocument();
  });
});
