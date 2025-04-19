"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material";

type Subscription = {
  subscription_id: string;
  subscription_plan: string;
  first_payment_data: string;
  amount_paid: number;
  currency: string;
};

type Feature = {
  id: string;
  name: string;
  description: string;
  currency: string;
  price: number;
  price_id: string;
};

export default function PremiumPage() {
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setSubscriptions([
        {
          subscription_id: "sub_001",
          subscription_plan: "Premium Plan",
          first_payment_data: "2025-04-01",
          amount_paid: 29.99,
          currency: "USD",
        },
      ]);

      setFeatures([
        {
          id: "feat_01",
          name: "Extra Job Applications",
          description: "Get 20 extra job applications this month.",
          currency: "USD",
          price: 4.99,
          price_id: "price_extra_jobs",
        },
        {
          id: "feat_02",
          name: "Profile Boost",
          description: "Highlight your profile to recruiters.",
          currency: "USD",
          price: 9.99,
          price_id: "price_boost",
        },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const handleBuyFeature = (featureId: string) => {
    alert(`Buying feature: ${featureId}`);
  };

  const handleSubscribe = () => {
    alert("Redirecting to subscribe...");
  };

  const handleCancelSubscription = (subscriptionId: string) => {
    alert(`Cancel subscription: ${subscriptionId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "1000px", margin: "0 auto", padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Premium Membership
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Manage your subscription, purchase features, and upgrade your experience.
      </Typography>

      <Divider sx={{ my: 4 }} />

      {/* Subscriptions Section */}
      <Typography variant="h6" gutterBottom>
        Your Subscriptions
      </Typography>
      <Grid container spacing={2}>
        {subscriptions.length === 0 ? (
          <Typography>No active subscriptions</Typography>
        ) : (
          subscriptions.map((sub) => (
            <Grid item xs={12} md={6} key={sub.subscription_id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">{sub.subscription_plan}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Started on: {sub.first_payment_data}
                  </Typography>
                  <Typography variant="body2">
                    {sub.amount_paid} {sub.currency}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ mt: 2 }}
                    onClick={() => handleCancelSubscription(sub.subscription_id)}
                  >
                    Cancel Subscription
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* One-Time Features */}
      <Typography variant="h6" gutterBottom>
        One-Time Features
      </Typography>
      <Grid container spacing={2}>
        {features.map((feat) => (
          <Grid item xs={12} md={6} key={feat.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1">{feat.name}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {feat.description}
                </Typography>
                <Typography fontWeight={600}>
                  {feat.price} {feat.currency}
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  fullWidth
                  onClick={() => handleBuyFeature(feat.id)}
                >
                  Buy Feature
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Subscribe Section */}
      <Typography variant="h6" gutterBottom>
        Ready to Go Premium?
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Unlock unlimited connections, messaging, and job applications.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleSubscribe}
      >
        Subscribe Now
      </Button>
    </Box>
  );
}
