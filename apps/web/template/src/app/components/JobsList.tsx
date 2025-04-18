'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, List, ListItem, Avatar, Typography, Divider, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

interface JobType {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  logo: string;
  promoted?: boolean;
  viewed?: boolean;
}

const JobList = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobType[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:5000/jobslist");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const handleNavigate = (job: JobType) => {
    const params = new URLSearchParams({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      id: job.id.toString(),
    });
    router.push(`/apply?${params.toString()}`);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/jobs/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error(`Failed to delete job with id ${id}`);
      setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
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
            <React.Fragment key={job.id}>
              <ListItem sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Avatar
                  src={job.logo}
                  alt={job.company}
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
                    {job.company} - {job.location} ({job.type})
                  </Typography>

                  <div style={{ display: "flex", alignItems: "center", gap: 1, marginTop: 4 }}>
                    {job.viewed && (
                      <Typography variant="caption" sx={{ color: "gray", fontWeight: "bold" }}>
                        Viewed •
                      </Typography>
                    )}
                    {job.promoted && (
                      <Typography variant="caption" sx={{ color: "gray" }}>
                        Promoted •
                      </Typography>
                    )}

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

                <IconButton size="small" onClick={() => handleDelete(job.id)}>
                  <CloseIcon fontSize="small" sx={{ color: "gray" }} />
                </IconButton>
              </ListItem>

              {index < jobs.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default JobList;
