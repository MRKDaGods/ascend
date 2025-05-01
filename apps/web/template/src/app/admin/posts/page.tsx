"use client";

import { useState, useEffect } from "react";
import ReportedPosts from "@/app/components/ReportedPosts";

import {
  getReportedPosts,
  deletePost,
  updatePostReport,
  getPostReports,
} from "@/app/utils/adminApi";

import {
  Pagination,
  Typography,
  CircularProgress,
  Stack,
  Box,
  MenuItem,
  FormControl,
  Button,
  InputLabel,
  Select,
} from "@mui/material";

type Status = "pending" | "reviewed" | "resolved" | "rejected";

export default function ManageReportedPosts() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openPostId, setOpenPostId] = useState<number | null>(null);
  const [reportPages, setReportPages] = useState<{
    [postId: number]: {
      data: any[];
      currentPage: number;
      totalPages: number;
    };
  }>({});
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
      // First find which post this report belongs to
      const post = reports.find((report) =>
        reportPages[report.id]?.data?.some((r) => r.id === reportId)
      );
      if (post) {
        // Refresh the report details for this specific post
        await fetchReportDetails(post.id, reportPages[post.id].currentPage);
      }
      // Refresh the main list
      await fetchReports();
    } catch (err) {
      console.error("Failed to update report status", err);
    }
  };

  const fetchReportDetails = async (postId: number, page: number = 1) => {
    try {
      const res = await getPostReports(postId, page);
      const data = res.data.data;
      const pagination = res.data.pagination;

      setReportPages((prev) => ({
        ...prev,
        [postId]: {
          data: data,
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
        },
      }));

      setOpenPostId(postId); //expand only selected post
    } catch (err) {
      console.error("Failed to fetch reports", err);
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
            <Box key={report.id}>
              <ReportedPosts
                key={report.id}
                report={report}
                onDelete={handleDeletePost}
                onUpdateStatus={handleUpdateStatus}
                fetchReportDetails={fetchReportDetails}
              />
              {/* This shows report details under the card when expanded */}
              {openPostId === report.id && (
                <Box pl={8} mt={1}>
                  <Typography fontWeight="bold">Reports:</Typography>
                  {reportPages[report.id]?.data?.map((r) => (
                    <Box
                      key={r.id}
                      p={2}
                      mb={1}
                      sx={{ border: "1px solid #ccc", borderRadius: 2 }}
                    >
                      <Typography variant="subtitle2">
                        {r.reporter_full_name}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Reason:</strong> {r.reason}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {r.description}
                      </Typography>
                      <Stack direction="row" spacing={2} mt={2}>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDeletePost(report.id)}
                        >
                          Delete Post
                        </Button>

                        <FormControl size="small">
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={r.status}
                            label="Status"
                            onChange={(e) =>
                              handleUpdateStatus(r.id, e.target.value as Status)
                            }
                            sx={{ minWidth: 120 }}
                          >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="reviewed">Reviewed</MenuItem>
                            <MenuItem value="resolved">Resolved</MenuItem>
                            <MenuItem value="rejected">Rejected</MenuItem>
                          </Select>
                        </FormControl>
                      </Stack>
                    </Box>
                  ))}
                  <Pagination
                    page={reportPages[report.id]?.currentPage || 1}
                    count={reportPages[report.id]?.totalPages || 1}
                    onChange={(_, newPage) =>
                      fetchReportDetails(report.id, newPage)
                    }
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
              )}
            </Box>
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
