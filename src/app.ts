import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import clientRouter from "./routes/clients";

export const createApp = () => {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(cookieParser());

  // Routes
  app.use("/api/auth", authRouter);
  app.use("/api/clients", clientRouter);

  // Health check
  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "Technext Task Server is Okay" });
  });

  return app;
};
