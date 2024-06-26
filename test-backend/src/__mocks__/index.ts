import { Request, Response } from "express-serve-static-core";

export const MockRequest = {
  query: {},
//   body: {}
} as Request;
export const MockResponse = {
  json: jest.fn(),
  status: jest.fn().mockReturnThis,
} as unknown as Response;
