import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import OrderForm from "../OrderForm";
import AppContext, { useAppContext } from "../../../app/contexts/AppContext";
import { useRouter, useSearchParams } from "next/navigation";

jest.mock("axios");
jest.mock("../../../app/contexts/AppContext");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: () => ({
    get: jest.fn().mockReturnValue(null),
  }),
}));

const mockRouter = {
  push: jest.fn(),
};

const mockSetLoading = jest.fn();
const mockFetchOrder = jest.fn();

const initialContext = {
  loading: null,
  setLoading: mockSetLoading,
  fetchOrder: mockFetchOrder,
  order: null,
};

describe("OrderForm", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAppContext as jest.Mock).mockReturnValue(initialContext);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form with initial state", () => {
    render(<OrderForm />);

    expect(screen.getByText("Create Order")).toBeInTheDocument();
    expect(screen.getByLabelText("Supplier")).toBeInTheDocument();
    expect(screen.getByLabelText("Order Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Total Amount")).toBeInTheDocument();
    expect(screen.getByLabelText("Status")).toBeInTheDocument();
    expect(screen.getByLabelText("Delivery Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Notes")).toBeInTheDocument();
    expect(screen.getByLabelText("Created By")).toBeInTheDocument();
    expect(screen.getByLabelText("Approved By")).toBeInTheDocument();
    expect(screen.getByLabelText("Currency")).toBeInTheDocument();
    expect(screen.getByLabelText("Payment Terms")).toBeInTheDocument();
  });

  it("handles form input changes", () => {
    render(<OrderForm />);

    const supplierInput = screen.getByLabelText("Supplier");
    fireEvent.change(supplierInput, { target: { value: "New Supplier" } });
    expect(supplierInput).toHaveValue("New Supplier");
  });

  test("handles adding and removing items", () => {
    render(<OrderForm />);
    const addItemButton = screen.getByRole("button", { name: /Add Item/i });
    fireEvent.click(addItemButton);
    expect(screen.getAllByLabelText("Product Name").length).toBe(2);

    const removeItemButton = screen.getAllByRole("button", {
      name: /Remove Item/i,
    })[1];
    fireEvent.click(removeItemButton);
    expect(screen.getAllByLabelText("Product Name").length).toBe(1);
  });

    test("handles form submission for new order", () => {
      render(<OrderForm />);
      const submitButton = screen.getByRole("button", { name: /Submit/i });
      fireEvent.click(submitButton);
      expect(mockSetLoading).toHaveBeenCalledWith("new-order");
    });
});
