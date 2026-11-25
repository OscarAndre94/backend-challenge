
import type { Request, Response } from "express";
import { jest } from "@jest/globals";

export const mockRequest = (
  body = {},
  params = {},
) => ({
  body,
  params,
}) as Request;

export const mockResponse = () => {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;
};
