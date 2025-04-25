import { Router } from "express";
import authMiddleware from "@shared/middleware/authMiddleware";
import { cancelPayment, cancelSubscription, completePayment, getFeatures, getFeaturesOwnedByUser, getSubscriptionPlans, getUserSubscriptions, getUserUsageLimits, handleFeaturePayment, handleSubscriptionPayment } from "../controllers/paymentController";

const paymentRoutes = Router();


paymentRoutes.get("/payments/features", authMiddleware, getFeatures);

paymentRoutes.post("/payments/features", authMiddleware, handleFeaturePayment);
paymentRoutes.get("/payments/process/complete", completePayment);
paymentRoutes.get("/payments/process/cancel", cancelPayment);

paymentRoutes.get("/payments/subscriptions", authMiddleware, getSubscriptionPlans);
paymentRoutes.post("/payments/subscriptions/process", authMiddleware, handleSubscriptionPayment);
paymentRoutes.delete("/payments/subscriptions/:subscriptionId", authMiddleware, cancelSubscription);

paymentRoutes.get("/payments/usage", authMiddleware, getUserUsageLimits);

paymentRoutes.get("/payments/features/purchased", authMiddleware, getFeaturesOwnedByUser);
paymentRoutes.get("/payments/subscriptions/purchased", authMiddleware, getUserSubscriptions);

export default paymentRoutes;