import express from "express";
import * as authService from "../services/auth.service";
import { successResponse, errorResponse } from "../utils/apiResponse";
import { ApiError } from "../utils/apiError";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);
    successResponse(res, { user }, 201, "User registered successfully");
  } catch (error) {
    if (error instanceof ApiError) {
      errorResponse(res, error.statusCode, error.message);
    } else {
      errorResponse(res, 500, "Internal server error");
    }
  }
});

router.post("/login", async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await authService.loginUser(
      req.body
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    successResponse(res, { user, accessToken }, 200, "Login successful");
  } catch (error) {
    if (error instanceof ApiError) {
      errorResponse(res, error.statusCode, error.message);
    } else {
      errorResponse(res, 500, "Internal server error");
    }
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new ApiError(401, "No refresh token provided");
    }

    const { accessToken } = await authService.refreshAccessToken(refreshToken);
    successResponse(res, { accessToken }, 200, "Token refreshed");
  } catch (error) {
    if (error instanceof ApiError) {
      errorResponse(res, error.statusCode, error.message);
    } else {
      errorResponse(res, 500, "Internal server error");
    }
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  successResponse(res, null, 200, "Logout successful");
});

export default router;
