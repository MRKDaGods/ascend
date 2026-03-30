'use client';

import API from "@/api/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Typography,
  TextField,
  Button,
  Box,
  Autocomplete,
  useTheme,
} from "@mui/material";
import { usepJobStore } from "../stores/usepJobStore";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// Rounded input styling
const roundedTextFieldStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '20px',
  }
};

const jobTitles = [
  "Software Engineer", "Senior Software Engineer", "Java Software Engineer",
  "Lead Software Engineer", "Software Engineering Manager", "Software Specialist",
  "Software Associate", "Full Stack Developer", "Frontend Developer", "Backend Developer", "DevOps Engineer"
];

type Company = {
  id: number;
  company_id: number;
  company_name: string;
};

export default function HireCard() {
  const theme = useTheme(); // 🌓 Get current theme
  const router = useRouter();

  const [name, setName] = useState("there");
  const [hasMounted, setHasMounted] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const { setTitle, setCompanyName } = usepJobStore();

  useEffect(() => {
    setHasMounted(true);

    API.get("/company/companies")
      .then(res => res.data)
      .then(data => {
        const companiesData = data?.data?.companies || [];
        setCompanies(companiesData);
      })
      .catch(err => console.error("Failed to fetch companies:", err));
  }, []);

  if (!hasMounted) return null;

  const handleStartWithDescription = () => {
    if (!selectedCompany) return alert("Please select a company.");
    setTitle(selectedTitle);
    setCompanyName(selectedCompany.company_name);
    usepJobStore.getState().setCompanyId(selectedCompany.company_id);
    router.push("/jobs/JobPosting");
  };

  const handleStartHiringWithAI = () => {
    if (!selectedCompany) return alert("Please select a company.");
    setTitle(selectedTitle);
    setCompanyName(selectedCompany.company_name);
    usepJobStore.getState().setCompanyId(selectedCompany.id);
    router.push("/AIpost-job");
  };

  return (
    <>
      {/* Main Hire Card */}
      <Card
        sx={{
          maxWidth: "1200px",
          margin: "auto",
          mt: 10,
          p: { xs: 3, md: 6 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 6,
          borderRadius: "16px",
          boxShadow: 4,
          alignItems: "center",
          bgcolor: theme.palette.background.paper,
        }}
      >
        {/* Left Content */}
        <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
          <Typography variant="h3" fontWeight={700} mb={3}>
            <Box
              component="span"
              sx={{
                background: "linear-gradient(90deg, rgb(98, 175, 253), #4b55c1 50%, #6a0dad)",
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

          <Box component="ul" sx={{ pl: 3, textAlign: "left" }}>
            <Typography component="li" mb={2}>Post a job faster by drafting a job description</Typography>
            <Typography component="li" mb={2}>Quickly presort applicants according to your criteria</Typography>
            <Typography component="li" mb={2}>Find up to 25 qualified people on Ascend per day to invite to apply</Typography>
          </Box>
        </Box>

        {/* Right Form Section */}
        <Box
          sx={{
            flex: "0 0 auto",
            p: "2px",
            borderRadius: "16px",
            background: "linear-gradient(90deg, rgb(98, 175, 253), #4b55c1 50%, #6a0dad)",
            width: { xs: "100%", md: "auto" },
          }}
        >
          <Box
            sx={{
              borderRadius: "14px",
              p: { xs: 3, md: 4 },
              bgcolor: theme.palette.background.default,
              display: "flex",
              flexDirection: "column",
              gap: 3,
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <Autocomplete
              freeSolo
              options={jobTitles}
              value={selectedTitle}
              onChange={(_, newValue) => setSelectedTitle(newValue || "")}
              onInputChange={(_, newValue) => setSelectedTitle(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Job title"
                  placeholder="Add the title you are hiring for"
                  fullWidth
                  margin="normal"
                  sx={roundedTextFieldStyle}
                />
              )}
            />

            <Autocomplete
              options={companies}
              getOptionLabel={(option) => option.company_name}
              value={selectedCompany}
              onChange={(_, newValue) => setSelectedCompany(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Company"
                  placeholder="Select your company"
                  fullWidth
                  margin="normal"
                  sx={roundedTextFieldStyle}
                />
              )}
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ borderRadius: "20px" }}
              onClick={handleStartHiringWithAI}
            >
              ✨ Start hiring with AI
            </Button>

            <Button
              variant="outlined"
              fullWidth
              sx={{ borderRadius: "20px" }}
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
          p: { xs: 3, md: 4 },
          borderRadius: "16px",
          bgcolor: theme.palette.mode === "light" ? "#f7f9fb" : theme.palette.background.paper,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: 4,
          mt: 6,
        }}
      >
        <Box sx={{ flex: 2, textAlign: { xs: "center", md: "left" } }}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Rated #1 in increasing quality of hire
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Post your job on the world's largest professional network and use simple tools to prioritize the most qualified candidates so you can find the people you want to interview, faster.
          </Typography>
        </Box>

        <Box sx={{ flex: 1, display: "flex", justifyContent: { xs: "center", md: "flex-end" }, mt: { xs: 3, md: 0 } }}>
          <img
            src="https://static.licdn.com/aero-v1/sc/h/cmzppdf78bnjxcszizjuq5sz2"
            alt="Hiring illustration"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Box>
      </Card>

      {/* Footer */}
      <Typography variant="caption" color="text.secondary" align="center" display="block" mt={2}>
        Hiring with AI will use profile and company information to suggest job post content.
        *If you purchase Promoted Plus, you will get additional AI-assisted job and sourcing features.{" "}
        <a href="#" style={{ color: theme.palette.primary.main }}>Learn more</a>
        <br />
        Limits may apply to free job posts.{" "}
        <a href="#" style={{ color: theme.palette.primary.main }}>View our policy</a>
      </Typography>
    </>
  );
}
