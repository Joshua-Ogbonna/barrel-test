import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import OrderList from "../OrderList";
import { PurchaseOrder } from "@/types";
import { useRouter } from "next/navigation";

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Sample orders data
const mockOrders: PurchaseOrder[] = [
  {
    id: 1,
    supplier: "Supplier A",
    orderDate: "2023-06-30",
    totalAmount: 1000,
    status: "Pending",
    items: [],
    paymentTerms: "",
    createdBy: "",
    currency: "",
  },
  {
    id: 2,
    supplier: "Supplier B",
    orderDate: "2023-07-01",
    totalAmount: 2000,
    status: "Completed",
    items: [],
    paymentTerms: "",
    createdBy: "",
    currency: "",
  },
];

describe("OrderList", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  it("renders the order list correctly", () => {
    render(<OrderList orders={mockOrders} />);

    // Check if table headers are rendered
    expect(screen.getByText("Order #")).toBeInTheDocument();
    expect(screen.getByText("Supplier")).toBeInTheDocument();
    expect(screen.getByText("Order Date")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();

    // Check if order data is rendered correctly
    expect(screen.getByText("#1")).toBeInTheDocument();
    expect(screen.getByText("Supplier A")).toBeInTheDocument();
    expect(screen.getByText("30/06/2023")).toBeInTheDocument();
    expect(screen.getByText("1,000")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();

    expect(screen.getByText("#2")).toBeInTheDocument();
    expect(screen.getByText("Supplier B")).toBeInTheDocument();
    expect(screen.getByText("01/07/2023")).toBeInTheDocument();
    expect(screen.getByText("2,000")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("renders the correct number of orders", () => {
    render(<OrderList orders={mockOrders} />);
    const rows = screen.getAllByRole("row");
    // +1 for the header row
    expect(rows).toHaveLength(mockOrders.length + 1);
  });

  it("calls router.push with correct path when View button is clicked", () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    render(<OrderList orders={mockOrders} />);

    const viewButtons = screen.getAllByText("View");
    fireEvent.click(viewButtons[0]);

    expect(mockPush).toHaveBeenCalledWith("/order/1");
  });

  it("renders empty table when no orders are provided", () => {
    render(<OrderList orders={[]} />);

    const rows = screen.getAllByRole("row");
    // Only the header row should be present
    expect(rows).toHaveLength(1);
  });
});
