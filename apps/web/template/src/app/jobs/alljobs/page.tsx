"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  useTheme,
} from "@mui/material";
import JobFilter from "@/app/components/JobFilter";
import { useJobFilterStore } from "@/app/stores/useJobFilterStore";
import JobItem from "@/app/components/JobItem";
import { useHasHydrated } from "@/app/hooks/useHasHydrated";
import MergeJobsNavbar from "@/app/components/MergeJobsNavbar";

const buildQuery = (filters: Record<string, any>) => {
  const query = new URLSearchParams();
  const keyMapping: Record<string, string> = {
    salary_range_min: "salary_min_range",
    salary_range_max: "salary_max_range",
  };

  for (const [key, value] of Object.entries(filters)) {
    if (
      value === undefined ||
      value === "" ||
      value === null ||
      (Array.isArray(value) && value.length === 0)
    )
      continue;

    const apiKey = keyMapping[key] || key;
    if (Array.isArray(value)) {
      query.append(apiKey, value.join(","));
    } else {
      query.append(apiKey, String(value).trim());
    }
  }
  return query.toString();
};

const cleanFilters = (filters: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(filters).filter(([key, value]) => {
      if (value === undefined || value === null || value === "") return false;
      if (Array.isArray(value) && value.length === 0) return false;
      if (
        ["salary_range_min", "salary_range_max"].includes(key) &&
        (value <= 0 || isNaN(value))
      )
        return false;
      return true;
    })
  );

export default function JobsPage() {
  const theme = useTheme();
  const {
    keyword,
    location,
    industry,
    experience_level,
    company,
    workplace_type,
    salary_range_min,
    salary_range_max,
    jobs,
    setJobs,
  } = useJobFilterStore();

  const [loading, setLoading] = useState(true);
  const hasHydrated = useHasHydrated();

  const fetchJobs = async () => {
    setLoading(true);

    const filters = cleanFilters({
      keyword,
      location,
      industry,
      experience_level: experience_level.length ? experience_level : undefined,
      company,
      workplace_type,
      salary_range_min: typeof salary_range_min === "number" && salary_range_min > 0
      ? salary_range_min
      : undefined,
    
    salary_range_max: typeof salary_range_max === "number" && salary_range_max > 0
      ? salary_range_max
      : undefined,
    });

    const queryString = buildQuery(filters);
    const url = `https://api.ascendx.tech/job/${queryString ? `?${queryString}` : ""}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        console.error(`API Error (${response.status})`);
        setJobs([]);
        return;
      }

      const data = await response.json();
      setJobs(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [
    keyword,
    location,
    industry,
    experience_level,
    company,
    workplace_type,
    salary_range_min,
    salary_range_max,
  ]);

  if (!hasHydrated) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <MergeJobsNavbar />
      <Box
        p={{ xs: 2, md: 4 }}
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          minHeight: "100vh",
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, md: 5 },
            mb: 5,
            borderRadius: 4,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[6],
          }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            sx={{
              color: theme.palette.text.primary,
              fontSize: { xs: "2rem", md: "2.8rem" },
            }}
          >
            Find Your Next Opportunity
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              mb: 4,
              maxWidth: "600px",
            }}
          >
            Use filters to refine your search and discover opportunities tailored to your skills and preferences.
          </Typography>

          <JobFilter />
        </Paper>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
            <CircularProgress />
          </Box>
        ) : jobs && jobs.length > 0 ? (
          <Grid container spacing={4}>
            {jobs.map((job) => {
              const formattedJob = {
                job_id: job.job_id,
                title: job.title,
                company: job.company_name,
                location: job.location,
                type: job.type,
                description: job.description,
                experienceLevel: job.experience_level,
                salaryRange:
                  job.salary_min_range != null && job.salary_max_range != null
                    ? `$${job.salary_min_range} - $${job.salary_max_range}`
                    : "Not specified",
              };

              return (
                <Grid item xs={12} sm={6} md={4} key={job.job_id}>
                  <JobItem {...formattedJob} />
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Box textAlign="center" mt={6}>
            <Typography variant="h6" color="text.secondary">
              No jobs found.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your filters to see more results.
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
}
