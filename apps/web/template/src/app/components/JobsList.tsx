'use client';
import React, { useEffect, useState } from "react";
import API from "@/api/api";
import { useRouter } from "next/navigation";
import {
  Card, CardContent, List, ListItem, Avatar, Typography, Divider,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReportIcon from "@mui/icons-material/Report";
import { fetchJobs } from "@/api/jobs"
import { useDeletedJobsStore } from "../stores/useDeletedJobsStore";

interface JobType {
  job_id: number;
  title: string;
  description: string;
  industry: string;
  type: string;
  experience_level: string;
  location: string;
  workplace_type: string;
  salary_min_range: number | null;
  salary_max_range: number | null;
  company_id: number;
  company_name: string;
  company_logo_url: string | null;
  created_at: Date;
}

const JobList = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobType[]>([]);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [jobToReport, setJobToReport] = useState<JobType | null>(null);
  const [reportReason, setReportReason] = useState("");

  const { deletedJobIds, deleteJob, loadDeletedJobs } = useDeletedJobsStore();

  useEffect(() => {
    loadDeletedJobs();
  }, []);
  
  useEffect(() => {
    loadJobs();
  }, [deletedJobIds]);

  const loadJobs = async () => {
    try {
      const result = await fetchJobs(1, 3); // Only fetch 3 jobs
      const filteredJobs = result.data.filter(
        (job: JobType) => !deletedJobIds.includes(job.job_id)
      );
      setJobs(filteredJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleNavigate = (job: JobType) => {
    const params = new URLSearchParams({
      id: job.job_id.toString(),
      title: job.title,
      company: job.company_name,
      location: job.location,
      type: job.type,
      description: job.description,
      industry: job.industry || '',
      experience_level: job.experience_level || '',
      workplace_type: job.workplace_type || '',
      ...(job.salary_min_range && { salary_min_range: job.salary_min_range.toString() }),
      ...(job.salary_max_range && { salary_max_range: job.salary_max_range.toString() })
    });
    
    router.push(`/jobs/apply?${params.toString()}`);
  };

  const handleDelete = (id: number) => {
    console.log(`Faking delete for job ID: ${id}`);
    deleteJob(id); // Zustand update
    setJobs((prev) => prev.filter((job) => job.job_id !== id)); // UI update
  };
  
  const handleReport = async (id: number) => {
    if (!reportReason.trim()) {
      alert("Please provide a valid reason for reporting.");
      return;
    }

    try {
      
      const response = await API.post(`/job/${id}/report`, {
        reason: reportReason,
        job_id: id,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Check if the response is OK without trying to parse it as JSON first
      if (!response.data) {
        const errorText = await response.data;
        console.error("Report failed:", errorText);
        alert(`Failed to submit the report: ${response.status} ${response.statusText}`);
        return;
      }

      // // Try to parse as JSON only if needed (or skip if you know it's just a text response)
      // let responseData;
      // const contentType = response.headers.get('content-type');
      // if (contentType && contentType.includes('application/json')) {
      //   responseData = await response.data;
      // } else {
      //   responseData = await response.data;
      // }
      // console.log("Report successful:", responseData);
      
      setReportDialogOpen(false);
      setReportReason("");
      setJobToReport(null);
      alert("Report submitted successfully.");
    } catch (error) {
      console.error("Report failed:", error);
      alert("An error occurred while submitting the report. Please try again later.");
    }
  };

  const openReportDialog = (job: JobType) => {
    setJobToReport(job);
    setReportDialogOpen(true);
  };

  const closeReportDialog = () => {
    setReportDialogOpen(false);
    setReportReason("");
    setJobToReport(null);
  };

  return (
    <Card sx={{ maxWidth: 700, mx: "auto", my: 3, boxShadow: 3, borderRadius: 3, p: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          All Available Jobs
        </Typography>

        <List>
          {jobs.map((job, index) => (
            <React.Fragment key={`${job.job_id}-${index}`}>
              <ListItem alignItems="flex-start">
                <Avatar
                  src={job.company_logo_url || ""}
                  alt={job.company_name}
                  sx={{ width: 50, height: 50, cursor: "pointer" }}
                  onClick={() => handleNavigate(job)}
                />
                <div style={{ flexGrow: 1, marginLeft: 16 }}>
                  <Typography
                    variant="body1"
                    color="#0073b1"
                    sx={{ cursor: "pointer", ":hover": { textDecoration: "underline" } }}
                    onClick={() => handleNavigate(job)}
                  >
                    {job.title}
                  </Typography>
                  <Typography variant="body2" color="gray">
                    {job.company_name} - {job.location} ({job.type})
                  </Typography>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                    <Typography
                      variant="caption"
                      sx={{ color: "#0077b5", fontWeight: "bold", cursor: "pointer" }}
                      onClick={() => handleNavigate(job)}
                    >
                      Easy Apply
                    </Typography>
                  </div>
                </div>
                <IconButton onClick={() => handleDelete(job.job_id)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  onClick={() => openReportDialog(job)}
                  sx={{ 
                    borderRadius: '50%', 
                    backgroundColor: 'rgba(255, 0, 0, 0.1)', 
                    '&:hover': { 
                      backgroundColor: 'rgba(255, 0, 0, 0.2)' 
                    }
                  }}
                >
                  <ReportIcon fontSize="small" sx={{ color: "red" }} />
                </IconButton>
              </ListItem>
              {index < jobs.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>

        <Typography
          variant="body2"
          sx={{ mt: 2, textAlign: "center", cursor: "pointer", fontWeight: "bold" }}
          onClick={() => router.push("/jobs/alljobs")}
        >
          Filter and Show More →
        </Typography>
      </CardContent>

      {/* Report Dialog */}
      <Dialog open={reportDialogOpen} onClose={closeReportDialog}>
        <DialogTitle>Report Job</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for Report"
            type="text"
            fullWidth
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={closeReportDialog} 
            color="secondary"
            sx={{ 
              borderRadius: '20px', 
              paddingX: '16px',
              textTransform: 'none' 
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => jobToReport && handleReport(jobToReport.job_id)}
            color="primary"
            variant="contained"
            sx={{ 
              borderRadius: '20px', 
              paddingX: '16px',
              textTransform: 'none' 
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default JobList;