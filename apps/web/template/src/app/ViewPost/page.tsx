"use client";
import { useJobStore } from "../JobPosting/store/useJobStore";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Avatar,
  Divider,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ViewPost = () => {
  const { postedJob } = useJobStore();
  const router = useRouter();

  useEffect(() => {
    if (!postedJob) {
      router.push("/"); // fallback if accessed directly
    }
  }, [postedJob]);

  if (!postedJob) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h6">No job to display.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 6, px: 2 }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={3}
        color="primary"
        sx={{ textAlign: "center" }}
      >
        This is the job you’ve posted
      </Typography>

      <Card
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          border: "1px solid #e0e0e0",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Avatar
            sx={{ width: 60, height: 60, bgcolor: "primary.main", fontWeight: "bold" }}
          >
            {postedJob.companyName?.[0]}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              {postedJob.title}
            </Typography>
            <Typography color="text.secondary" fontSize="1rem">
              {postedJob.companyName}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {postedJob.location}
            </Typography>
            <Stack direction="row" spacing={1} mt={1}>
              <Chip label={postedJob.workplaceType} color="primary" size="small" />
              <Chip label={postedJob.jobType} color="secondary" size="small" />
            </Stack>
          </Box>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h6" fontWeight="medium" gutterBottom>
            Job Description
          </Typography>
          <Typography color="text.secondary" whiteSpace="pre-line">
            {postedJob.description || "No description provided."}
          </Typography>
        </Box>

        {postedJob.email && (
          <Box mt={4}>
            <Typography variant="h6" fontWeight="medium" gutterBottom>
              Contact Email
            </Typography>
            <Typography color="text.secondary">{postedJob.email}</Typography>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default ViewPost;
