"use client";

import { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Typography,
  MenuItem,
  Select,
} from "@mui/material";

import {
  getUsersCount,
  getJobsCount,
  getPostsCount,
  getConnectionsCount,
  getFollowsCount,
  getReportedJobsCount,
  getReportedPostsCount,
  getSubscriptionsCount,
} from "@/app/utils/adminApi";

import AnalyticsCard from "@/app/components/AnalyticsCard";
import { Subscriptions } from "@mui/icons-material";

export default function AdminDashboard() {
  const [duration, setDuration] = useState<"day" | "week" | "month" | "year">(
    "day"
  );
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    users: 0,
    jobs: 0,
    posts: 0,
    connections: 0,
    follows: 0,
    reportedJobs: 0,
    reportedPosts: 0,
    Subscriptions: 0,
  });

  useEffect(() => {
    async function fetchCounts() {
      setLoading(true);
      try {
        const [
          users,
          jobs,
          posts,
          connections,
          follows,
          reportedJobs,
          reportedPosts,
          subscriptions,
        ] = await Promise.all([
          getUsersCount(duration),
          getJobsCount(duration),
          getPostsCount(duration),
          getConnectionsCount(duration),
          getFollowsCount(duration),
          getReportedJobsCount(duration),
          getReportedPostsCount(duration),
          getSubscriptionsCount(duration),
        ]);

        setCounts({
          users: users.data.count,
          jobs: jobs.data.count,
          posts: posts.data.count,
          connections: connections.data.count,
          follows: follows.data.count,
          reportedJobs: reportedJobs.data.count,
          reportedPosts: reportedPosts.data.count,
          Subscriptions: subscriptions.data.count,
        });
      } catch (err) {
        console.error("Error fetching counts", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCounts();
  }, [duration]);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          mb: 4,
          color: "#1a237e",
          textAlign: "center",
        }}
      >
        Platform Analytics
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="duration-label">Duration</InputLabel>
          <Select
            labelId="duration-label"
            aria-label="Select analytics duration"
            value={duration}
            label="Duration"
            onChange={(e) =>
              setDuration(e.target.value as "day" | "week" | "month" | "year")
            }
          >
            <MenuItem value="day" aria-label="Today">
              Today
            </MenuItem>
            <MenuItem value="week" aria-label="This week">
              This Week
            </MenuItem>
            <MenuItem value="month" aria-label="This month">
              This Month
            </MenuItem>
            <MenuItem value="year" aria-label="This year">
              This Year
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <Box
          display="flex"
          flexWrap="wrap"
          gap={4}
          justifyContent="center"
          sx={{ maxWidth: 1200, margin: "0 auto" }}
        >
          <AnalyticsCard
            title="Total Users"
            value={counts.users}
            color="#2196f3"
          />
          <AnalyticsCard
            title="Total Jobs"
            value={counts.jobs}
            color="#4caf50"
          />
          <AnalyticsCard
            title="Total Posts"
            value={counts.posts}
            color="#ff9800"
          />
          <AnalyticsCard
            title="Connections"
            value={counts.connections}
            color="#9c27b0"
          />
          <AnalyticsCard
            title="Follows"
            value={counts.follows}
            color="#f44336"
          />
          <AnalyticsCard
            title="Reported Jobs"
            value={counts.reportedJobs}
            color="#795548"
          />
          <AnalyticsCard
            title="Reported Posts"
            value={counts.reportedPosts}
            color="#607d8b"
          />
          <AnalyticsCard
            title="Premium Users"
            value={counts.Subscriptions}
            color="#ff5722"
          />
        </Box>
      )}
    </Box>
  );
}
