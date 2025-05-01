"use client";

import { useState, useEffect } from "react";
import ReportedJobCard from "./ReportedJobCard";

import {
  getReportedJobs,
  updateJobReport,
  deleteJob,
} from "@/app/utils/adminApi";

import {
  Pagination,
  Typography,
  CircularProgress,
  Stack,
  Box,
} from "@mui/material";

export default function () {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchReports();
  }, [page]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await getReportedJobs(page);
      setReports(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching reported posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await deleteJob(jobId);
      fetchReports(); // refresh
    } catch (err) {
      console.error("Failed to delete post", err);
    }
  };

  const handleUpdateStatus = async (
    reportId: number,
    newStatus: "pending" | "reviewed" | "resolved" | "rejected"
  ) => {
    try {
      await updateJobReport(reportId, newStatus);
      fetchReports(); // refresh
    } catch (err) {
      console.error("Failed to update report status", err);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Manage Reported Jobs
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : Array.isArray(reports) && reports.length > 0 ? (
        <Stack spacing={3}>
          {reports.map((report) => (
            <ReportedJobCard
              key={report.id}
              report={report}
              onDelete={handleDeleteJob}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </Stack>
      ) : (
        <Typography>No reported jobs found.</Typography>
      )}
      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
}
