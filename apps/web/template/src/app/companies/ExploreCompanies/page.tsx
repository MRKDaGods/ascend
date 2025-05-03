"use client";

import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useCompanyStore } from "@/app/stores/useCreateCompanyStore";
import Navbar from "@/app/components/Navbar";

function getLoggedInUserId(): number | null {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.user_id || payload.id || null;
  } catch (err) {
    console.error("❌ Failed to parse token:", err);
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
      router.push("/companies/CreateCompanyPage/Company/CompanyPageItself");
    } else {
      router.push("/companies/CreateCompanyPageUser");
    }
  };

  const renderCompanyCards = (companyList: any[]) => {
    if (!Array.isArray(companyList)) return null;

    return (
      <Grid id="company-cards-grid" container spacing={3} mt={2}>
        {companyList.map((company: any) => (
          <Grid
            id={`company-card-grid-${company.company_id}`}
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={company.company_id}
          >
            <Card
              id={`company-card-${company.company_id}`}
              sx={{
                cursor: "pointer",
                borderRadius: 2,
                "&:hover": { boxShadow: 6 },
              }}
              onClick={() => handleNavigateToCompany(company.company_id)}
            >
              <CardMedia
                id={`company-card-media-${company.company_id}`}
                component="img"
                height="140"
                image={company.profile_photo_url || "/placeholder.png"}
                alt={company.company_name}
                sx={{ objectFit: "cover" }}
              />
              <CardContent id={`company-card-content-${company.company_id}`}>
                <Typography
                  id={`company-card-title-${company.company_id}`}
                  variant="h6"
                  noWrap
                >
                  {company.company_name}
                </Typography>
                <Typography
                  id={`company-card-industry-${company.company_id}`}
                  variant="body2"
                  color="text.secondary"
                  noWrap
                >
                  {company.industry}
                </Typography>
                <Typography
                  id={`company-card-location-${company.company_id}`}
                  variant="body2"
                  color="text.secondary"
                  noWrap
                >
                  {company.location}
                </Typography>
                <Typography
                  id={`company-card-followers-${company.company_id}`}
                  variant="caption"
                  display="block"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Followers: {followerCounts[company.company_id] ?? 0}
                </Typography>
                <Button
                  id={`company-card-follow-button-${company.company_id}`}
                  size="small"
                  variant={
                    followingStatus[company.company_id]
                      ? "outlined"
                      : "contained"
                  }
                  color="primary"
                  sx={{ mt: 1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (userId) toggleFollowCompany(company.company_id, userId);
                  }}
                >
                  {followingStatus[company.company_id] ? "Unfollow" : "Follow"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <>
      <Navbar />
      <Container id="explore-companies-container" maxWidth="lg" sx={{ py: 6 }}>
        <Tabs
          id="explore-companies-tabs"
          value={tab}
          onChange={(_, newVal) => setTab(newVal)}
          centered
        >
          <Tab id="my-companies-tab" label="My Companies" />
          <Tab id="explore-companies-tab" label="Explore Companies" />
        </Tabs>

        <Typography
          id="explore-companies-subtitle"
          variant="subtitle1"
          color="text.secondary"
          gutterBottom
          mt={2}
        >
          Discover companies and their mission, industry, and team.
        </Typography>

        {tab === 0 && renderCompanyCards(companies)}
        {tab === 1 && renderCompanyCards(exploreCompanies)}
      </Container>
    </>
  );
}
