"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
} from "@mui/material";
import API from "@/api/api"; // Import your API instance

interface Feature {
  id: string;
  name: string;
  description: string | null;
  currency: string;
  price: number;
  price_id: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  currency: string;
  price: number;
  price_id: string;
}

interface PurchasedFeature {
  feature_purchased: string;
  payment_date: string;
  amount_paid: number;
  currency: string;
  enabled: boolean;
}

interface PurchasedSubscription {
  subscription_id: string;
  subscription_plan: string;
  first_payment_data: string;
  amount_paid: number;
  currency: string;
}

const PremiumPage = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionPlan[]>([]);
  const [purchasedFeatures, setPurchasedFeatures] = useState<
    PurchasedFeature[]
  >([]);
  const [purchasedSubscriptions, setPurchasedSubscriptions] = useState<
    PurchasedSubscription[]
  >([]);
  const [loading, setLoading] = useState({
    features: true,
    subscriptions: true,
    purchasedFeatures: true,
    purchasedSubscriptions: true,
  });
  const [error, setError] = useState<string | null>(null);

  // The token is now handled by the API interceptor, no need to set it manually

  useEffect(() => {
    // Fetch available features
    API.get("/payment/payments/features")
      .then((res) => {
        setFeatures(res.data.data.features || []);
        setLoading((prev) => ({ ...prev, features: false }));
      })
      .catch((err) => {
        console.error("Error fetching features:", err);
        setLoading((prev) => ({ ...prev, features: false }));
      });

    // Fetch available subscriptions
    API.get("/payment/payments/subscriptions")
      .then((res) => {
        setSubscriptions(res.data.data.subscription_plans || []);
        setLoading((prev) => ({ ...prev, subscriptions: false }));
      })
      .catch((err) => {
        console.error("Error fetching subscriptions:", err);
        setLoading((prev) => ({ ...prev, subscriptions: false }));
      });

    // Fetch purchased features
    API.get("/payment/payments/features/purchased")
      .then((res) => {
        setPurchasedFeatures(res.data.data.features || []);
        setLoading((prev) => ({ ...prev, purchasedFeatures: false }));
      })
      .catch((err) => {
        console.error("Error fetching purchased features:", err);
        setLoading((prev) => ({ ...prev, purchasedFeatures: false }));
      });

    // Fetch purchased subscriptions
    API.get("/payment/payments/subscriptions/purchased")
      .then((res) => {
        setPurchasedSubscriptions(res.data.data.subscriptions || []);
        setLoading((prev) => ({ ...prev, purchasedSubscriptions: false }));
      })
      .catch((err) => {
        console.error("Error fetching purchased subscriptions:", err);
        setLoading((prev) => ({ ...prev, purchasedSubscriptions: false }));
      });
  }, []);

  const handleBuyFeature = (price_id: string) => {
    setError(null);
    API.post("/payment/payments/features", {
      features: [{ price_id }],
      relative_return_url: "feed",
    })
      .then((res) => {
        if (res.data.error) {
          setError(res.data.error);
        } else {
          window.location.href = res.data.data.url;
        }
      })
      .catch((err) => {
        console.error("Error buying feature:", err);
        setError(err.response?.data?.error || "Failed to process payment");
      });
  };

  const handleSubscribe = (subscription_price_id: string) => {
    setError(null);
    API.post("/payment/payments/subscriptions/process", {
      subscription_price_id,
      relative_return_url: "feed",
    })
      .then((res) => {
        if (res.data.error) {
          setError(res.data.error);
        } else {
          console.log(res.data.data.url); // Log the URL for debugging
          window.location.href = res.data.data.url;
        }
      })
      .catch((err) => {
        console.error("Error subscribing:", err);
        setError(err.response?.data?.error || "Failed to process subscription");
      });
  };

  const cancelSubscription = (subscription_id: string) => {
    setError(null);
    API.delete(`/payment/payments/subscriptions/${subscription_id}`)
      .then((res) => {
        alert(res.data.message);
        // Refresh purchased subscriptions
        return API.get("/payment/payments/subscriptions/purchased");
      })
      .then((res) => {
        setPurchasedSubscriptions(res.data.data.subscriptions || []);
      })
      .catch((err) => {
        console.error("Error canceling subscription:", err);
        setError(err.response?.data?.error || "Failed to cancel subscription");
      });
  };

  // Display error message if any
  if (error) {
    // You could create a more sophisticated error handling UI component
    console.error(error);
  }

  return (
    <Box sx={{ padding: "2rem", bgcolor: "#f4f4f4" }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        id="premium-page-title"
      >
        Premium Features & Subscriptions
      </Typography>

      {error && (
        <Box
          sx={{
            bgcolor: "error.light",
            color: "error.contrastText",
            p: 2,
            mb: 3,
            borderRadius: 1,
          }}
        >
          <Typography>{error}</Typography>
        </Box>
      )}

      <Grid container spacing={4}>
        {/* Available Features Section */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ boxShadow: 3 }} id="available-features-section">
            <CardContent>
              <Typography variant="h6" id="available-features-title">
                Available Features
              </Typography>
              <Divider sx={{ marginY: 2 }} />
              {loading.features ? (
                <Typography>Loading features...</Typography>
              ) : features.length === 0 ? (
                <Typography id="no-features-message">
                  No features available
                </Typography>
              ) : (
                features.map((f) => (
                  <Box
                    key={f.id}
                    sx={{ marginBottom: 2 }}
                    id={`feature-${f.id}`}
                  >
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      id={`feature-name-${f.id}`}
                    >
                      {f.name}
                    </Typography>
                    <Typography variant="body2" id={`feature-price-${f.id}`}>
                      {f.price} {f.currency}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleBuyFeature(f.price_id)}
                      sx={{ marginTop: 1 }}
                      id={`buy-feature-button-${f.id}`}
                    >
                      Buy Feature
                    </Button>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Available Subscriptions Section */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ boxShadow: 3 }} id="available-subscriptions-section">
            <CardContent>
              <Typography variant="h6" id="available-subscriptions-title">
                Available Subscriptions
              </Typography>
              <Divider sx={{ marginY: 2 }} />
              {loading.subscriptions ? (
                <Typography>Loading subscriptions...</Typography>
              ) : subscriptions.length === 0 ? (
                <Typography id="no-subscriptions-message">
                  No subscriptions available
                </Typography>
              ) : (
                subscriptions.map((s) => (
                  <Box
                    key={s.id}
                    sx={{ marginBottom: 2 }}
                    id={`subscription-${s.id}`}
                  >
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      id={`subscription-name-${s.id}`}
                    >
                      {s.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      id={`subscription-price-${s.id}`}
                    >
                      {s.price} {s.currency}
                    </Typography>
                    <Typography
                      variant="body2"
                      id={`subscription-description-${s.id}`}
                    >
                      {s.description}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleSubscribe(s.price_id)}
                      sx={{ marginTop: 1 }}
                      id={`subscribe-button-${s.id}`}
                    >
                      Subscribe
                    </Button>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Purchased Features Section */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ boxShadow: 3 }} id="purchased-features-section">
            <CardContent>
              <Typography variant="h6" id="purchased-features-title">
                Purchased Features
              </Typography>
              <Divider sx={{ marginY: 2 }} />
              {loading.purchasedFeatures ? (
                <Typography>Loading purchased features...</Typography>
              ) : purchasedFeatures.length === 0 ? (
                <Typography id="no-purchased-features-message">
                  No features purchased
                </Typography>
              ) : (
                purchasedFeatures.map((pf, index) => (
                  <Box
                    key={index}
                    sx={{ marginBottom: 2 }}
                    id={`purchased-feature-${index}`}
                  >
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      id={`purchased-feature-name-${index}`}
                    >
                      {pf.feature_purchased}
                    </Typography>
                    <Typography
                      variant="body2"
                      id={`purchased-feature-price-${index}`}
                    >
                      {pf.amount_paid} {pf.currency}
                    </Typography>
                    <Typography
                      variant="body2"
                      id={`purchased-feature-enabled-${index}`}
                    >
                      Enabled: {pf.enabled ? "Yes" : "No"}
                    </Typography>
                    <Typography
                      variant="body2"
                      id={`purchased-feature-date-${index}`}
                    >
                      Purchased on: {new Date(pf.payment_date).toLocaleString()}
                    </Typography>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Purchased Subscriptions Section */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ boxShadow: 3 }} id="purchased-subscriptions-section">
            <CardContent>
              <Typography variant="h6" id="purchased-subscriptions-title">
                Purchased Subscriptions
              </Typography>
              <Divider sx={{ marginY: 2 }} />
              {loading.purchasedSubscriptions ? (
                <Typography>Loading purchased subscriptions...</Typography>
              ) : purchasedSubscriptions.length === 0 ? (
                <Typography id="no-purchased-subscriptions-message">
                  No subscriptions purchased
                </Typography>
              ) : (
                purchasedSubscriptions.map((ps, index) => (
                  <Box
                    key={index}
                    sx={{ marginBottom: 2 }}
                    id={`purchased-subscription-${index}`}
                  >
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      id={`purchased-subscription-name-${index}`}
                    >
                      {ps.subscription_plan}
                    </Typography>
                    <Typography
                      variant="body2"
                      id={`purchased-subscription-price-${index}`}
                    >
                      {ps.amount_paid} {ps.currency}
                    </Typography>
                    <Typography
                      variant="body2"
                      id={`purchased-subscription-date-${index}`}
                    >
                      First payment:{" "}
                      {new Date(ps.first_payment_data).toLocaleString()}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => cancelSubscription(ps.subscription_id)}
                      sx={{ marginTop: 1 }}
                      id={`cancel-subscription-button-${index}`}
                    >
                      Cancel Subscription
                    </Button>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PremiumPage;
