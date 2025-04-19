'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, List, ListItem, Avatar, Typography, Divider, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

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
    const fetchJobs = async () => {
      try {
        const response = await fetch("https://api.ascendx.tech/job/search");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();
        setJobs(result.data); // ✅ Adapted to nested 'data' structure
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

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

      if (!response.ok) throw new Error(`Failed to delete job with id ${id}`);
      setJobs(prevJobs => prevJobs.filter(job => job.job_id !== id));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <Card sx={{ maxWidth: 700, mx: "auto", my: 3, boxShadow: 3, borderRadius: 3, p: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "black" }}>
          All Available Jobs
        </Typography>

        <List>
          {jobs.map((job, index) => (
            <React.Fragment key={job.job_id}>
              <ListItem sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Avatar
                  src={job.company_logo_url || ""}
                  alt={job.company_name}
                  sx={{ width: 50, height: 50, cursor: "pointer" }}
                  onClick={() => handleNavigate(job)}
                />
                <div style={{ flexGrow: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{ color: "#0073b1", cursor: "pointer", ":hover": { textDecoration: "underline" } }}
                    onClick={() => handleNavigate(job)}
                  >
                    {job.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "gray" }}>
                    {job.company_name} - {job.location} ({job.type})
                  </Typography>

                  <div style={{ display: "flex", alignItems: "center", gap: 1, marginTop: 4 }}>
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

                <IconButton size="small" onClick={() => handleDelete(job.job_id)}>
                  <CloseIcon fontSize="small" sx={{ color: "gray" }} />
                </IconButton>
              </ListItem>

              {index < jobs.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>

        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            color: "black",
            cursor: "pointer",
            mt: 2,
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
          onClick={() => router.push("/alljobs")}
        >
          Show all →
        </Typography>
      </CardContent>
    </Card>
  );
};

export default JobList;
