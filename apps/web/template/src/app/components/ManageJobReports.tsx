"use client";

import { useState, useEffect } from "react";
import ReportedJobCard from "./ReportedJobCard";
import {
  getReportedJobs,
  updateJobReport,
  deleteJob,
  getJobReports,
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

export default function ManageReportedJobs() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openJobId, setOpenJobId] = useState<number | null>(null);
  const [reportPages, setReportPages] = useState<{
    [jobId: number]: {
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
      const response = await getReportedJobs(page);
      const cleaned = response.data.data.filter((r: any) => r && r.job_id != null);
      setReports(cleaned);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching reported jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
      await deleteJob(jobId);
      fetchReports();
    } catch (err) {
      console.error("Failed to delete job", err);
    }
  };

  const handleUpdateStatus = async (
    reportId: number,
    newStatus: Status
  ) => {
    try {
      await updateJobReport(reportId, newStatus);

      const job = reports.find((report) =>
        reportPages[report.job_id]?.data?.some((r) => r.id === reportId)
      );
      if (job) {
        await fetchReportDetails(job.job_id, reportPages[job.job_id].currentPage);
      }
      else {
        await fetchReports();
      }
      
    } catch (err) {
      console.error("Failed to update report status", err);
    }
  };

  const fetchReportDetails = async (jobId: number, page: number = 1) => {
    try {
      const res = await getJobReports(jobId, page);
      const data = res.data.data;
      const pagination = res.data.pagination;

      setReportPages((prev) => ({
        ...prev,
        [jobId]: {
          data: data,
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
        },
      }));

      setOpenJobId(jobId);
    } catch (err) {
      console.error("Failed to fetch reports", err);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Manage Reported Jobs
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : reports.length > 0 ? (
        <Stack spacing={3}>
          {reports.map((report) => (
            <Box key={report.job_id}>
              <ReportedJobCard
                report={report}
                onDelete={handleDeleteJob}
                onUpdateStatus={handleUpdateStatus}
                fetchReportDetails={fetchReportDetails}
              />

              {openJobId === report.job_id && (
                <Box pl={8} mt={1}>
                  <Typography fontWeight="bold">Reports:</Typography>
                  {reportPages[report.job_id]?.data?.map((r) => (
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
                          aria-label={`Delete job ${report.job_id}`}
                          color="error"
                          onClick={() => handleDeleteJob(report.job_id)}
                        >
                          Delete Job
                        </Button>

                        <FormControl size="small">
                          <InputLabel>Status</InputLabel>
                          <Select
                            value={r.status}
                            label="Status"
                            aria-label={`Change status of report ${r.id}`}
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
                    page={reportPages[report.job_id]?.currentPage || 1}
                    aria-label={`Pagination for job ${report.job_id}`}
                    count={reportPages[report.job_id]?.totalPages || 1}
                    onChange={(_, newPage) =>
                      fetchReportDetails(report.job_id, newPage)
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
        <Typography>No reported jobs found.</Typography>
      )}

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
