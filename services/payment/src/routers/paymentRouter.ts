import { Router } from "express";
import express from 'express';
import authMiddleware from "@shared/middleware/authMiddleware";
import { cancelPayment, cancelSubscription, completePayment, getFeatures, getFeaturesOwnedByUser, getSubscriptionPlans, getUserSubscriptions, getUserUsageLimits, handleFeaturePayment, handleSubscriptionPayment, insertSurveyResponse, stripeWebhookHandler } from "../controllers/paymentController";
import { featurePurchaseValidation, subscriptionCancellationValidation, subscriptionValidation, surveyResponseValidation } from "../validations/paymentValidations";

const paymentRoutes = Router();


paymentRoutes.get("/payments/features", authMiddleware, getFeatures);

paymentRoutes.post("/payments/features", authMiddleware, featurePurchaseValidation, handleFeaturePayment);
paymentRoutes.get("/payments/process/complete", completePayment);
paymentRoutes.get("/payments/process/cancel", cancelPayment);

paymentRoutes.get("/payments/subscriptions", authMiddleware, getSubscriptionPlans);
paymentRoutes.post("/payments/subscriptions/process", authMiddleware, subscriptionValidation, handleSubscriptionPayment);
paymentRoutes.delete("/payments/subscriptions/:subscriptionId", authMiddleware, subscriptionCancellationValidation, cancelSubscription);

paymentRoutes.get("/payments/usage", authMiddleware, getUserUsageLimits);

paymentRoutes.get("/payments/features/purchased", authMiddleware, getFeaturesOwnedByUser);
paymentRoutes.get("/payments/subscriptions/purchased", authMiddleware, getUserSubscriptions);

paymentRoutes.post("/payments/survey", authMiddleware, surveyResponseValidation, insertSurveyResponse);
paymentRoutes.post("/webhook", express.raw({type : 'application/json'}), stripeWebhookHandler);

export default paymentRoutes;