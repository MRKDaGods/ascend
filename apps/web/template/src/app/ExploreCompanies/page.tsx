'use client';

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useCompanyStore } from '@/app/stores/useCreateCompanyStore';

function getLoggedInUserId(): number | null {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user_id || payload.id || null;
  } catch (err) {
    console.error('❌ Failed to parse token:', err);
    return null;
  }
}

export default function ExploreCompaniesPage() {
  const router = useRouter();
  const userId = getLoggedInUserId();
  const [tab, setTab] = useState(0);

  const {
    companies,
    exploreCompanies,
    fetchAllCompanies,
    fetchExploreCompanies,
    followerCounts,
    followingStatus,
    fetchCompanyFollowers,
    toggleFollowCompany,
    fetchCompanyProfile,
  } = useCompanyStore();

  useEffect(() => {
    if (tab === 0) {
      fetchAllCompanies();
    } else {
      fetchExploreCompanies();
    }
  }, [tab]);

  useEffect(() => {
    if (userId) {
      const list = tab === 0 ? companies : exploreCompanies;
      if (Array.isArray(list)) {
        for (const company of list) {
          fetchCompanyFollowers(company.company_id, userId);
        }
      }
    }
  }, [tab, companies, exploreCompanies, userId]);

  const handleNavigateToCompany = async (companyId: number) => {
    await fetchCompanyProfile(companyId);
    if (tab === 0) {
      router.push('/CreateCompanyPage/Company/CompanyPageItself');
    } else {
      router.push('/CreateCompanyPageUser');
    }
  };

  const renderCompanyCards = (companyList: any[]) => {
    if (!Array.isArray(companyList)) return null;

    return (
      <Grid container spacing={3} mt={2}>
        {companyList.map((company: any) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={company.company_id}>
            <Card
              sx={{ cursor: 'pointer', borderRadius: 2, '&:hover': { boxShadow: 6 } }}
              onClick={() => handleNavigateToCompany(company.company_id)}
            >
              <CardMedia
                component="img"
                height="140"
                image={company.profile_photo_url || '/placeholder.png'}
                alt={company.company_name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6" noWrap>{company.company_name}</Typography>
                <Typography variant="body2" color="text.secondary" noWrap>{company.industry}</Typography>
                <Typography variant="body2" color="text.secondary" noWrap>{company.location}</Typography>
                <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                  Followers: {followerCounts[company.company_id] ?? 0}
                </Typography>
                <Button
                  size="small"
                  variant={followingStatus[company.company_id] ? 'outlined' : 'contained'}
                  color="primary"
                  sx={{ mt: 1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (userId) toggleFollowCompany(company.company_id, userId);
                  }}
                >
                  {followingStatus[company.company_id] ? 'Unfollow' : 'Follow'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Tabs value={tab} onChange={(_, newVal) => setTab(newVal)} centered>
        <Tab label="My Companies" />
        <Tab label="Explore Companies" />
      </Tabs>

      <Typography variant="subtitle1" color="text.secondary" gutterBottom mt={2}>
        Discover companies and their mission, industry, and team.
      </Typography>

      {tab === 0 && renderCompanyCards(companies)}
      {tab === 1 && renderCompanyCards(exploreCompanies)}
    </Container>
  );
}
