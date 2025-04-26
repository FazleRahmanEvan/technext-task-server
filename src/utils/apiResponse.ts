/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express";

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
  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
