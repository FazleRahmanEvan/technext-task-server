/* eslint-disable @typescript-eslint/no-explicit-any */

import { Client } from "../models/Client";
import { ApiError } from "../utils/apiError";
import { clientSchema } from "../utils/validators";

export const createClient = async (userId: string, data: any) => {
  const validatedData = clientSchema.parse(data);
  const client = await Client.create({ ...validatedData, userId });
  return client;
};

export const getClients = async (userId: string) => {
  return await Client.find({ userId }).sort({ createdAt: -1 });
};

export const getClient = async (userId: string, clientId: string) => {
  const client = await Client.findOne({ _id: clientId, userId });
  if (!client) {
    throw new ApiError(404, "Client not found", {
      clientId: "Client with this ID does not exist",
    });
  }
  return client;
};

export const updateClient = async (
  userId: string,
  clientId: string,
  data: any
) => {
  const validatedData = clientSchema.partial().parse(data);
  const client = await Client.findOneAndUpdate(
    { _id: clientId, userId },
    validatedData,
    { new: true }
  );
  if (!client) throw new ApiError(404, "Client not found");
  return client;
};

export const deleteClient = async (userId: string, clientId: string) => {
  const client = await Client.findOneAndDelete({ _id: clientId, userId });
  if (!client) throw new ApiError(404, "Client not found");
};
