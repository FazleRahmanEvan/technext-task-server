/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

export const successResponse = <T>(
  res: Response,
  data: T,
  statusCode = 200,
  message = "Success"
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: any
) => {
  const response: ApiResponse<null> = {
    success: false,
    message,
    errors,
  };
  res.status(statusCode).json(response);
};
