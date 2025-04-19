'use client';

import React from 'react';
import { Card, CardContent, Typography, CardMedia, Box } from '@mui/material';
import { useRouter } from 'next/navigation';

type Props = {
  title: string;
  subtitle: string;
  image: string;
  href: string;
};

export default function PageTypeCard({ title, subtitle, image, href }: Props) {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(href)}
      sx={{
        width: 250,
        textAlign: 'center',
        borderRadius: 2,
        boxShadow: 2,
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 4,
        },
      }}
    >
      <Box
        sx={{
          overflow: 'hidden',
          p: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CardMedia
          component="img"
          height="60"
          image={image}
          alt={title}
          sx={{
            objectFit: 'contain',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)', // Zoom on hover
            },
          }}
        />
      </Box>
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
}
