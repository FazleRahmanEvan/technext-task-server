import express from "express";
import * as clientService from "../services/client.service";
import { authenticate } from "../middleware/auth";
import { errorResponse, successResponse } from "../utils/apiResponse";
import { ApiError } from "../utils/apiError";

const router = express.Router();

router.use(authenticate);

router.post("/", async (req, res) => {
  try {
    const client = await clientService.createClient(req.user.id, req.body);
    successResponse(res, client, 201, "Client created successfully");
  } catch (error) {
    if (error instanceof ApiError) {
      errorResponse(res, error.statusCode, error.message, error.errors);
    } else {
      errorResponse(res, 500, "Internal server error", error);
    }
  }
});

router.get("/", async (req, res) => {
  try {
    const clients = await clientService.getClients(req.user.id);
    successResponse(res, clients);
  } catch (error) {
    if (error instanceof ApiError) {
      errorResponse(res, error.statusCode, error.message, error.errors);
    } else {
      errorResponse(res, 500, "Internal server error", error);
    }
  }
});

router.get("/:id", async (req, res) => {
  try {
    const client = await clientService.getClient(req.user.id, req.params.id);
    successResponse(res, client);
  } catch (error) {
    if (error instanceof ApiError) {
      errorResponse(res, error.statusCode, error.message, error.errors);
    } else {
      errorResponse(res, 500, "Internal server error", error);
    }
  }
});

router.put("/:id", async (req, res) => {
  try {
    const client = await clientService.updateClient(
      req.user.id,
      req.params.id,
      req.body
    );
    successResponse(res, client, 200, "Client updated successfully");
  } catch (error) {
    if (error instanceof ApiError) {
      errorResponse(res, error.statusCode, error.message, error.errors);
    } else {
      errorResponse(res, 500, "Internal server error", error);
    }
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await clientService.deleteClient(req.user.id, req.params.id);
    successResponse(res, null, 200, "Client deleted successfully");
  } catch (error) {
    if (error instanceof ApiError) {
      errorResponse(res, error.statusCode, error.message, error.errors);
    } else {
      errorResponse(res, 500, "Internal server error", error);
    }
  }
});

export default router;
