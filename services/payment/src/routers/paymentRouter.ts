import { Router } from "express";
import authMiddleware from "@shared/middleware/authMiddleware";

const paymentRoutes = Router();

paymentRoutes.post("/payments/process", authMiddleware);

paymentRoutes.post("/subscriptions", authMiddleware);
paymentRoutes.delete("/subscriptions/:subscriptionId", authMiddleware);
paymentRoutes.get("/subscriptions/:subscriptionId", authMiddleware);
paymentRoutes.put("/subscriptions/:subscriptionId", authMiddleware);

paymentRoutes.get("/usage/:userId", authMiddleware);
