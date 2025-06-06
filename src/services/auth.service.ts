/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { User } from "../models/User";
import { ApiError } from "../utils/apiError";
import { registerSchema, loginSchema } from "../utils/validators";

if (!env.JWT_SECRET || !env.JWT_EXPIRES_IN || !env.REFRESH_TOKEN_EXPIRES_IN) {
  throw new Error("Missing environment variables for JWT");
}

export const registerUser = async (data: any) => {
  const validatedData = registerSchema.parse(data);

  const existingUser = await User.findOne({ email: validatedData.email });
  if (existingUser) {
    throw new ApiError(400, "Email already in use");
  }

  const user = await User.create(validatedData);
  return user;
};

export const loginUser = async (data: any) => {
  const validatedData = loginSchema.parse(data);

  const user = await User.findOne({ email: validatedData.email });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await user.comparePassword(validatedData.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  //   const accessToken = jwt.sign({ id: user._id, email: user.email }, env.JWT_SECRET, {
  //     expiresIn: env.JWT_EXPIRES_IN,
  //   });
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  const refreshToken = jwt.sign({ id: user._id }, env.JWT_SECRET, {
    expiresIn: "10d",
  });

  return { user, accessToken, refreshToken };
};

export const refreshAccessToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, "Invalid token");
    }

    const newAccessToken = jwt.sign({ id: user._id }, env.JWT_SECRET, {
      expiresIn: "14h",
    });

    return { accessToken: newAccessToken };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw new ApiError(401, "Invalid or expired token");
  }
};
