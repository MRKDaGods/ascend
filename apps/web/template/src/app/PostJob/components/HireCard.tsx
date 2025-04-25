"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Typography,
  TextField,
  Button,
  Box,
  Autocomplete,
} from "@mui/material";
import { usepJobStore } from "@/app/JobPosting/store/usepJobStore";

const jobTitles = [
  "Software Engineer",
  "Senior Software Engineer",
  "Java Software Engineer",
  "Lead Software Engineer",
  "Software Engineering Manager",
  "Software Specialist",
  "Software Associate",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "DevOps Engineer",
];

export default function HireCard() {
  const [name, setName] = useState("there");
  const [hasMounted, setHasMounted] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [companyInput, setCompanyInput] = useState("");

  const router = useRouter();

  const { setTitle, setCompanyName } = usepJobStore();

  useEffect(() => {
    setHasMounted(true);
    fetch("http://localhost:5000/api/user")
      .then((res) => res.json())
      .then((data) => {
        setName(data.name || "there");
      })
      .catch((err) => console.error("Failed to fetch user:", err));
  }, []);

  if (!hasMounted) return null;

  const handleStartWithDescription = () => {
    setTitle(selectedTitle);
    setCompanyName(companyInput);
    router.push("/JobPosting");
  };

  return (
    <>
      <Card
        sx={{
          maxWidth: "1200px",
          margin: "auto",
          mt: 10,
          p: 6,
          display: "flex",
          gap: 6,
          borderRadius: "16px",
          boxShadow: 4,
        }}
      >
        {/* Left Section */}
        <Box flex={1}>
          <Typography variant="h3" fontWeight={700} mb={3}>
            <Box
              component="span"
              sx={{
                background:
                  "linear-gradient(90deg, rgb(98, 175, 253), #4b55c1 50%, #6a0dad)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 700,
              }}
            >
              Hi {name},
            </Box>
            <br />
            find your next great hire
          </Typography>

          <Typography variant="subtitle1" color="text.secondary" mb={4}>
            86% of small businesses get a qualified candidate in one day
          </Typography>

          <Typography fontWeight={600} mb={2}>
            As your AI-assistant, I can help you:
          </Typography>

          <Box component="ul" sx={{ pl: 3 }}>
            <Typography component="li" mb={2}>
              Post a job faster by drafting a job description
            </Typography>
            <Typography component="li" mb={2}>
              Quickly presort applicants according to your criteria
            </Typography>
            <Typography component="li" mb={2}>
              Find up to 25 qualified people on LinkedIn per day to invite to apply
            </Typography>
          </Box>
        </Box>

        {/* Right Form */}
        <Box
          sx={{
            flex: 1,
            borderRadius: "16px",
            p: "2px",
            background:
              "linear-gradient(90deg, rgb(98, 175, 253), #4b55c1 50%, #6a0dad)",
          }}
        >
          <Box
            sx={{
              borderRadius: "14px",
              p: 4,
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Typography variant="body2" fontWeight={600}>
              Job title
            </Typography>
            <Autocomplete
              freeSolo
              options={jobTitles}
              inputValue={selectedTitle}
              onInputChange={(e, newValue) => setSelectedTitle(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Add the title you are hiring for"
                  size="small"
                  fullWidth
                />
              )}
            />

            <Typography variant="body2" fontWeight={600}>
              Company
            </Typography>
            <TextField
              value={companyInput}
              onChange={(e) => setCompanyInput(e.target.value)}
              placeholder="Enter company name"
              size="small"
              fullWidth
            />

            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#0a66c2",
                color: "#fff",
                textTransform: "none",
                mt: 4,
              }}
              onClick={() => {
                setTitle(selectedTitle);
                setCompanyName(companyInput);
                router.push("/AIpost-job");
              }}
            >
              ✨ Start hiring with AI
            </Button>

            <Button
              variant="outlined"
              size="large"
              sx={{ textTransform: "none" }}
              onClick={handleStartWithDescription}
            >
              Start with my job description
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Info Section */}
      <Card
        sx={{
          maxWidth: "1200px",
          margin: "40px auto 0",
          p: 4,
          borderRadius: "16px",
          backgroundColor: "#f7f9fb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Box flex={2}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Rated #1 in increasing quality of hire
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Post your job on the world’s largest professional network and use
            simple tools to prioritize the most qualified candidates so you can
            find the people you want to interview, faster.
          </Typography>
        </Box>

        <Box flex={1} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <img
            src="https://static.licdn.com/aero-v1/sc/h/cmzppdf78bnjxcszizjuq5sz2"
            alt="Hiring illustration"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Box>
      </Card>

      {/* Footer */}
      <Typography
        variant="caption"
        color="text.secondary"
        align="center"
        display="block"
        mt={2}
      >
        Hiring with AI will use profile and company information to suggest job
        post content. *If you purchase Promoted Plus, you will get additional
        AI-assisted job and sourcing features.{" "}
        <a href="#" style={{ color: "#0a66c2" }}>
          Learn more
        </a>
        <br />
        Limits may apply to free job posts.{" "}
        <a href="#" style={{ color: "#0a66c2" }}>
          View our policy
        </a>
      </Typography>
    </>
  );
}
