'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, List, ListItem, Avatar, Typography, Divider, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

interface JobType {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  logo: string;
  reviewTime: string;
  promoted?: boolean;
  viewed?: boolean;
}

const JobPicks = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobType[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/jobs");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data: JobType[] = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  // Delete Job Handler
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/jobs/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error(`Failed to delete job with id ${id}`);

      // Remove job from UI
      setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <Card sx={{ maxWidth: 700, mx: "auto", my: 3, boxShadow: 3, borderRadius: 3, p: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "black" }}>
          Top job picks for you
        </Typography>
        <Typography variant="body2" sx={{ color: "gray", mb: 2 }}>
          Based on your profile, preferences, and activity like applies, searches, and saves
        </Typography>

        <List>
          {jobs.map((job, index) => (
            <React.Fragment key={job.id}>
              <ListItem sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Avatar src={job.logo} alt={job.company} sx={{ width: 50, height: 50 , cursor: "pointer"}} onClick={() => router.push(`/companypage`)} />

                <div style={{ flexGrow: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: "", color: "#0073b1", cursor: "pointer", ":hover": { textDecoration: "underline" } }} onClick={() => router.push(`/companypage`)}>
                    {job.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "gray" }}>
                    {job.company} - {job.location} ({job.type})
                  </Typography>

                  {job.reviewTime !== "N/A" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 1, marginTop: 4 }}>
                      <CheckCircleOutlineIcon fontSize="small" sx={{ color: "green" }} />
                      <Typography variant="caption" sx={{ color: "gray" }}>
                        Applicant review time is typically {job.reviewTime}
                      </Typography>
                    </div>
                  )}

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
                      onClick={() => router.push(`/apply`)}
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
          onClick={() => router.push(`/apply`)}
        >
          Show all →
        </Typography>
      </CardContent>
    </Card>
  );
};

export default JobPicks;
