// app/page.tsx
'use client';

import React from 'react';
import { Container, Typography, Box } from '@mui/material';
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

  return (
    <Container id="create-company-page-container" maxWidth="md" sx={{ py: 8 }}>
      <Typography id="create-company-page-title" variant="h4" align="center" gutterBottom>
    <>
    <Navbar />
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Create an Ascend Page
      </Typography>
      <Typography
        id="create-company-page-subtitle"
        variant="subtitle1"
        align="center"
        color="text.secondary"
        gutterBottom
      >
        Connect with clients, employees, and the Ascend community. To get started, choose a page type.
      </Typography>
      <Box
        id="create-company-page-types-container"
        display="flex"
        justifyContent="center"
        gap={3}
        flexWrap="wrap"
        mt={5}
      >
        {pageTypes.map((type, index) => (
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
    </>
  );
}
