// app/page.tsx
'use client';

import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import PageTypeCard from '@/app/components/PageTypeCard';
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
  {
    title: 'Showcase page',
    subtitle: 'Sub-pages associated with an existing page',
    image: '/Showcase_Page.png',
    href: '/create/showcase',
  },
  {
    title: 'Educational institution',
    subtitle: 'Schools and universities',
    image: '/Education_institution.png',
    href: '/create/education',
  },
];

export default function CreateLinkedInPage() {
  const router = useRouter();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Create a LinkedIn Page
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
        Connect with clients, employees, and the LinkedIn community. To get started, choose a page type.
      </Typography>
      <Box display="flex" justifyContent="center" gap={3} flexWrap="wrap" mt={5}>
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
  );
}
