'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  List,
  ListItem,
  Avatar,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { fetchJobs } from "../lib/api";

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

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const result = await fetchJobs(1, 3); // Only fetch 3 jobs
      setJobs(result.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleNavigate = (job: JobType) => {
    const params = new URLSearchParams({
      title: job.title,
      company: job.company_name,
      location: job.location,
      type: job.type,
      id: job.job_id.toString(),
    });
    router.push(`/apply?${params.toString()}`);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`https://api.ascendx.tech/job/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error();
      setJobs((prev) => prev.filter((job) => job.job_id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
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
                    <LinkedInIcon fontSize="small" sx={{ color: "#0077b5" }} />
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
              </ListItem>
              {index < jobs.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>

        <Typography
          variant="body2"
          sx={{ mt: 2, textAlign: "center", cursor: "pointer", fontWeight: "bold" }}
          onClick={() => router.push("/alljobs")}
        >
          Show more →
        </Typography>
      </CardContent>
    </Card>
  );
};

export default JobList;
