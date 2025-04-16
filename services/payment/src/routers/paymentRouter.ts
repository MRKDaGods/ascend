import { Router } from "express";
import authMiddleware from "@shared/middleware/authMiddleware";

const paymentRoutes = Router();


paymentRoutes.get("/payments/features", authMiddleware);

paymentRoutes.post("/payments/process", authMiddleware);
paymentRoutes.get("/payments/process/complete", authMiddleware);
paymentRoutes.get("/payments/process/cancel", authMiddleware);

paymentRoutes.get("/payments/subscriptions", authMiddleware);
paymentRoutes.post("/payments/subscriptions", authMiddleware);
paymentRoutes.delete("/payments/subscriptions/:subscriptionId", authMiddleware);
paymentRoutes.get("/payments/subscriptions/:subscriptionId", authMiddleware);
paymentRoutes.put("/payments/subscriptions/:subscriptionId", authMiddleware);

paymentRoutes.get("/payments/usage/:userId", authMiddleware);
