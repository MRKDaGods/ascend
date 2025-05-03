"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  CircularProgress,
  useTheme,
    Paper,
} from "@mui/material";
import { getCompanyJobsAPI } from "@/api/company";
import { useCompanyStore } from "@/app/stores/useCreateCompanyStore";

interface Job {
  job_id: number;
  title: string;
  description: string;
  type: string;
  experience_level: string;
  location: string;
  workplace_type: string;
  salary_min_range: number;
  salary_max_range: number;
  created_at: string;
}

const CompanyJobsLists = () => {
  const theme = useTheme();
  const { companyId } = useCompanyStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!companyId) return;
      try {
        const jobs = await getCompanyJobsAPI(companyId);
        setJobs(jobs || []);
      } catch (error) {
        console.error("❌ Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [companyId]);

  if (!companyId) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="body1" color="text.secondary">
          Company ID not available. Please select a company first.
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box textAlign="center" py={4}>
        <CircularProgress />
        <Typography variant="body2" mt={2}>
          Loading jobs...
        </Typography>
      </Box>
    );
  }

  if (jobs.length === 0) {
    return (
      <Box>
        {  /* Header */}
        <Paper id="page-posts-header" variant="outlined" sx={{ p: 2, borderRadius: 2, maxWidth: "32%" }}>
          <Typography id="page-posts-title" variant="h5" fontWeight={600} mb={0.5}>
            Company Jobs
          </Typography>
        </Paper>

        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary">
            No jobs found for this company.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    
    <Box>
        {  /* Header */}
        <Paper id="page-posts-header" variant="outlined" sx={{ p: 2, borderRadius: 2, maxWidth: "32%" }}>
          <Typography id="page-posts-title" variant="h5" fontWeight={600} mb={0.5}>
            Company Jobs
          </Typography>
        </Paper>
      {/* Job Cards */}
      <Grid container spacing={3} mt={1}>
        {jobs.map((job) => (
          <Grid item xs={12} sm={6} md={4} key={job.job_id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                bgcolor: theme.palette.background.paper,
                borderRadius: 2,
                boxShadow: 3,
                transition: "0.3s",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" fontWeight={600}>
                    {job.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(job.created_at).toLocaleDateString()}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {job.description.length > 100
                    ? job.description.slice(0, 100) + "..."
                    : job.description}
                </Typography>

                <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
                  <Chip label={job.type} size="small" color="primary" />
                  <Chip label={job.experience_level} size="small" color="success" />
                  <Chip label={job.workplace_type} size="small" color="info" />
                  <Chip label={job.location} size="small" color="secondary" />
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Salary: ${job.salary_min_range.toLocaleString()} - $
                  {job.salary_max_range.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CompanyJobsLists;
