"use client";

import { useState, useEffect } from "react";
import ReportedPosts from "@/app/components/ReportedPosts";

import {
  getReportedPosts,
  deletePost,
  updatePostReport,
} from "@/app/utils/adminApi";

import { Pagination,Typography,CircularProgress,Stack,Box } from "@mui/material";

export default function ManageReportedPosts() {
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
      const response = await getReportedPosts(page);
      setReports(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching reported posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(postId);
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
      await updatePostReport(reportId, newStatus);
      fetchReports(); // refresh
    } catch (err) {
      console.error("Failed to update report status", err);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Manage Reported Posts
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : Array.isArray(reports) && reports.length > 0 ? (
        <Stack spacing={3}>
          {reports.map((report) => (
            <ReportedPosts
              key={report.id}
              report={report}
              onDelete={handleDeletePost}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </Stack>
      ) : (
        <Typography>No reported posts found.</Typography>
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
