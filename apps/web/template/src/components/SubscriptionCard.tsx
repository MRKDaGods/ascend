// components/SubscriptionCard.tsx
"use client";

import { Button, Card, CardContent, Typography } from "@mui/material";

type Props = {
  name: string;
  description: string;
  price: number;
  currency: string;
  onSubscribe: () => void;
};

export default function SubscriptionCard({
  name,
  description,
  price,
  currency,
  onSubscribe,
}: Props) {
  return (
    <Card sx={{ maxWidth: 400, margin: 2, borderRadius: 3, boxShadow: 4 }}>
      <CardContent>
        <Typography variant="h5" fontWeight="bold">
          {name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {description}
        </Typography>
        <Typography variant="h6">
          {price === 0 ? "Free" : `${currency.toUpperCase()} ${price}`}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={onSubscribe}
        >
          {price === 0 ? "Current Plan" : "Subscribe"}
        </Button>
      </CardContent>
    </Card>
  );
}
