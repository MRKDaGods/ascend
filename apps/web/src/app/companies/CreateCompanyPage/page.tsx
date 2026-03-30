'use client';

import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PageTypeCard from '@/app/components/PageTypeCard';
import Navbar from '@/app/components/Navbar';
import { useRouter } from 'next/navigation';

type PageType = {
  title: string;
  subtitle: string;
  image: string;
  href: string;
};

const pageTypes: PageType[] = [
  {
    title: 'Company',
    subtitle: 'Small, medium, and large businesses',
    image: '/Company.png',
    href: 'Company',
  },
];

export default function CreateLinkedInPage() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Navbar />
      <Container 
        maxWidth="md" 
        sx={{ 
          py: 8,
          px: { xs: 2, sm: 3 },
        }}
      >
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 600,
          }}
        >
          Create an Ascend Page
        </Typography>
        <Typography 
          variant="subtitle1" 
          align="center" 
          sx={{
            color: theme.palette.text.secondary,
            mb: 4,
          }}
        >
          Connect with clients, employees, and the Ascend community. To get started, choose a page type.
        </Typography>
        <Box 
          display="flex" 
          justifyContent="center" 
          gap={3} 
          flexWrap="wrap" 
          sx={{
            mt: 5,
            '& > *': {
              bgcolor: theme.palette.background.paper,
              borderRadius: 2,
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[4],
              },
            },
          }}
        >
          {pageTypes.map((type) => (
            <PageTypeCard
              key={type.title}
              title={type.title}
              subtitle={type.subtitle}
              image={type.image}
              href={type.href}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
}