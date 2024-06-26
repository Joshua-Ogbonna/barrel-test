import { MockRequest, MockResponse } from "../__mocks__";
import { createOrder, getOrders } from "../handlers";
import { PaginatedProducts, PurchaseOrder } from "../types";
import { purchaseOrdersResponse } from "../utils/generateOrders";
import express from "express";
import request from 'supertest';

// Mock the purchaseOrdersResponse
jest.mock("../utils/generateOrders", () => ({
  purchaseOrdersResponse: {
    orders: [],
  },
}));

const app = express();
app.use(express.json());
app.post('/orders', createOrder);

describe("get orders", () => {
  it("should return array of orders", () => {
    const res = MockResponse;

    getOrders(MockRequest, res);

    const expectedResponse: PaginatedProducts = {
      orders: expect.any(Array),
      total: expect.any(Number),
      limit: expect.any(Number),
      page: expect.any(Number),
      pages: expect.any(Number),
    };

    expect(MockResponse.json).toHaveBeenCalledWith({ data: expectedResponse });
  });
});

describe('createOrder', () => {
    beforeEach(() => {
      purchaseOrdersResponse.orders = [];
    });
  
    it('should create a new order with valid input', async () => {
      const newOrder = {
        supplier: 'Test Supplier',
        orderDate: '2024-06-26',
        items: [
          {
            productId: 1,
            productName: 'Test Product',
            quantity: 5,
            price: 10,
            unit: 'pcs',
            discount: 0,
            totalPrice: 50
          }
        ],
        totalAmount: 50,
        status: 'pending',
        createdBy: 'Test User',
        currency: 'USD',
        paymentTerms: 'Net 30'
      };
  
      const response = await request(app)
        .post('/orders')
        .send(newOrder)
        .expect(201);
  
      expect(response.body.data).toMatchObject({
        id: 1,
        ...newOrder
      });
      expect(response.body.message).toBe('Order created successfully!');
      expect(purchaseOrdersResponse.orders.length).toBe(1);
    });
  
    it('should return 400 if required fields are missing', async () => {
      const incompleteOrder = {
        supplier: 'Test Supplier',
        orderDate: '2024-06-26'
        // Missing other required fields
      };
  
      const response = await request(app)
        .post('/orders')
        .send(incompleteOrder)
        .expect(400);
  
      expect(response.body.message).toBe('Missing required fields');
      expect(purchaseOrdersResponse.orders.length).toBe(0);
    });
  
    it('should handle optional fields correctly', async () => {
      const orderWithOptionalFields = {
        supplier: 'Test Supplier',
        orderDate: '2024-06-26',
        items: [
          {
            productId: 1,
            productName: 'Test Product',
            quantity: 5,
            price: 10,
            unit: 'pcs',
            discount: 0,
            totalPrice: 50
          }
        ],
        totalAmount: 50,
        status: 'pending',
        createdBy: 'Test User',
        currency: 'USD',
        paymentTerms: 'Net 30',
        deliveryDate: '2024-07-26',
        notes: 'Test notes',
        approvedBy: 'Test Approver'
      };
  
      const response = await request(app)
        .post('/orders')
        .send(orderWithOptionalFields)
        .expect(201);
  
      expect(response.body.data).toMatchObject(orderWithOptionalFields);
      expect(purchaseOrdersResponse.orders.length).toBe(1);
    });
  
    it('should handle errors gracefully', async () => {
      // Simulate an error by making purchaseOrdersResponse undefined
      (purchaseOrdersResponse as any) = undefined;
  
      const newOrder = {
        supplier: 'Test Supplier',
        orderDate: '2024-06-26',
        items: [
          {
            productId: 1,
            productName: 'Test Product',
            quantity: 5,
            price: 10,
            unit: 'pcs',
            discount: 0,
            totalPrice: 50
          }
        ],
        totalAmount: 50,
        status: 'pending',
        createdBy: 'Test User',
        currency: 'USD',
        paymentTerms: 'Net 30'
      };
  
      const response = await request(app)
        .post('/orders')
        .send(newOrder)
        .expect(500); 
  
      expect(response.body).toHaveProperty('error');
    });
  });
  
