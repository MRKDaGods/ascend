'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Typography, Divider, Grid } from '@mui/material';
import { useRouter } from 'next/router';

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
  const [purchasedFeatures, setPurchasedFeatures] = useState<PurchasedFeature[]>([]);
  const [purchasedSubscriptions, setPurchasedSubscriptions] = useState<PurchasedSubscription[]>([]);

  const token = 'Bearer YOUR_JWT_TOKEN'; // Replace with your actual token
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': token,
  };

  useEffect(() => {
    // Fetch available features
    fetch('https://api.ascendx.tech/payment/payments/features', { headers })
      .then(res => res.json())
      .then(res => setFeatures(res.data.features))
      .catch(console.error);

    // Fetch available subscriptions
    fetch('https://api.ascendx.tech/payment/payments/subscriptions', { headers })
      .then(res => res.json())
      .then(res => setSubscriptions(res.data.subscription_plans))
      .catch(console.error);

    // Fetch purchased features
    fetch('https://ascendx.tech/payment/payments/features/purchased', { headers })
      .then(res => res.json())
      .then(res => setPurchasedFeatures(res.data.features))
      .catch(console.error);

    // Fetch purchased subscriptions
    fetch('https://ascendx.tech/payment/payments/subscriptions/purchased', { headers })
      .then(res => res.json())
      .then(res => setPurchasedSubscriptions(res.data.features))
      .catch(console.error);
  }, []);

  const handleBuyFeature = (price_id: string) => {
    fetch('https://api.ascendx.tech/payment/payments/features', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        features: [{ price_id }],
        relative_return_url: '/feed',
      }),
    })
      .then(res => res.ok && res.json())
      .then(({ data: { url } }) => (window.location = url))
      .catch(console.error);
  };

  const handleSubscribe = (subscription_price_id: string) => {
    fetch('https://api.ascendx.tech/payment/payments/subscriptions/process', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        subscription_price_id,
        relative_return_url: '/feed',
      }),
    })
      .then(res => res.ok && res.json())
      .then(({ data: { url } }) => (window.location = url))
      .catch(console.error);
  };

  const cancelSubscription = (subscription_id: string) => {
    fetch(`https://api.ascendx.tech/payment/subscriptions/${subscription_id}`, {
      method: 'DELETE',
      headers,
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        // Refresh purchased subscriptions
        fetch('https://ascendx.tech/payment/payments/subscriptions/purchased', { headers })
          .then(res => res.json())
          .then(res => setPurchasedSubscriptions(res.data.features));
      })
      .catch(console.error);
  };

  return (
    <Box sx={{ padding: '2rem', bgcolor: '#f4f4f4' }}>
      <Typography variant="h4" gutterBottom align="center">
        Premium Features & Subscriptions
      </Typography>

      <Grid container spacing={4}>
        {/* Available Features Section */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Available Features</Typography>
              <Divider sx={{ marginY: 2 }} />
              {features.length === 0 ? (
                <Typography>No features available</Typography>
              ) : (
                features.map(f => (
                  <Box key={f.id} sx={{ marginBottom: 2 }}>
                    <Typography variant="body1" fontWeight="bold">{f.name}</Typography>
                    <Typography variant="body2">{f.price} {f.currency}</Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleBuyFeature(f.price_id)}
                      sx={{ marginTop: 1 }}
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
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Available Subscriptions</Typography>
              <Divider sx={{ marginY: 2 }} />
              {subscriptions.length === 0 ? (
                <Typography>No subscriptions available</Typography>
              ) : (
                subscriptions.map(s => (
                  <Box key={s.id} sx={{ marginBottom: 2 }}>
                    <Typography variant="body1" fontWeight="bold">{s.name}</Typography>
                    <Typography variant="body2">{s.price} {s.currency}</Typography>
                    <Typography variant="body2">{s.description}</Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleSubscribe(s.price_id)}
                      sx={{ marginTop: 1 }}
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
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Purchased Features</Typography>
              <Divider sx={{ marginY: 2 }} />
              {purchasedFeatures.length === 0 ? (
                <Typography>No features purchased</Typography>
              ) : (
                purchasedFeatures.map((pf, index) => (
                  <Box key={index} sx={{ marginBottom: 2 }}>
                    <Typography variant="body1" fontWeight="bold">{pf.feature_purchased}</Typography>
                    <Typography variant="body2">{pf.amount_paid} {pf.currency}</Typography>
                    <Typography variant="body2">Enabled: {pf.enabled ? 'Yes' : 'No'}</Typography>
                    <Typography variant="body2">
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
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Purchased Subscriptions</Typography>
              <Divider sx={{ marginY: 2 }} />
              {purchasedSubscriptions.length === 0 ? (
                <Typography>No subscriptions purchased</Typography>
              ) : (
                purchasedSubscriptions.map((ps, index) => (
                  <Box key={index} sx={{ marginBottom: 2 }}>
                    <Typography variant="body1" fontWeight="bold">{ps.subscription_plan}</Typography>
                    <Typography variant="body2">{ps.amount_paid} {ps.currency}</Typography>
                    <Typography variant="body2">
                      First payment: {new Date(ps.first_payment_data).toLocaleString()}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => cancelSubscription(ps.subscription_id)}
                      sx={{ marginTop: 1 }}
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
