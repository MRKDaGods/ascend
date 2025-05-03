"use client";
import API from "@/api/api";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  LinearProgress,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import { deepOrange, green } from "@mui/material/colors";
import { useRouter } from "next/navigation";

const question1 = {
  question:
    "Which of these best describes your primary goal for using Premium?",
  options: [
    "I'd use Premium for my personal goals",
    "I'd use Premium as part of my job",
    "Other",
  ],
};

const personalGoalsOptions = [
  "To job search with confidence and get hired",
  "To develop my professional skills",
  "To grow my network, business, or reputation",
  "To find and contact new leads",
  "To find and hire talent faster",
  "Other",
];

const jobGoalsOptions = [
  "Get personalized career guidance and insights",
  "Grow my skills with 21,000+ courses",
  "Earn and showcase professional certificates",
  "Learn from bite‐sized or in‐depth videos",
  "Build daily learning habits",
  "Other",
];

const PremiumSurvey = () => {
  const [step, setStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [subOptions, setSubOptions] = useState<string[]>([]);
  const router = useRouter();
  const totalSteps = 2;

  const progress = ((step + 1) / (totalSteps + 1)) * 100;

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleNext = () => {
    if (step === 0) {
      if (selectedOption === "I'd use Premium for my personal goals") {
        setSubOptions(personalGoalsOptions);
        setStep(1);
        setSelectedOption("");
      } else if (selectedOption === "I'd use Premium as part of my job") {
        setSubOptions(jobGoalsOptions);
        setStep(1);
        setSelectedOption("");
      } else if (selectedOption === "Other") {
        router.push("/prem/premium");
      }
    } else if (step === 1) {
      API.post("/payment/payments/survey", {
        question: "What do you hope to achieve with Premium?",
        answers: subOptions,
        user_choice: subOptions.findIndex((opt) => opt === selectedOption),
      })
        .then(() => {
          router.push("/prem/premium");
        })
        .catch((e) => {
          console.error(e);
        });
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setSelectedOption("");
    }
  };

  const renderQuestion = () => {
    if (step === 0) {
      return question1;
    } else {
      return {
        question: "What do you hope to achieve with Premium?",
        options: subOptions,
      };
    }
  };

  const currentQuestion = renderQuestion();

  return (
    <Box
      sx={{ p: 4, backgroundColor: "#f3f2ef", minHeight: "100vh" }}
      id="premium-survey-container"
    >
      <Box sx={{ maxWidth: 900, mx: "auto", mb: 4 }} id="premium-survey-header">
        <Typography variant="h6" gutterBottom id="survey-header-title">
          The average career is 42 years. Drive sales and boost your success
          with Sales Navigator.
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          id="survey-header-subtitle"
        >
          Millions of members use Premium
        </Typography>
        <Typography variant="body2" id="survey-header-description">
          Claim your 1-month free trial today. Cancel anytime. We’ll send you a
          reminder 7 days before your trial ends.
        </Typography>
        <Box
          sx={{ mt: 2, position: "relative" }}
          id="survey-progress-container"
        >
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              "& .MuiLinearProgress-bar": {
                backgroundColor: green[500],
              },
            }}
            id="survey-progress-bar"
          />
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              top: -20,
              right: 0,
              color: green[500],
              fontWeight: "bold",
            }}
            id="survey-progress-percentage"
          >
            {Math.round(progress)}%
          </Typography>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 600, mx: "auto" }} id="survey-question-container">
        <Paper elevation={1} sx={{ p: 3 }} id="survey-question-paper">
          <Box
            sx={{ display: "flex", alignItems: "center", mb: 2 }}
            id="survey-question-header"
          >
            <Avatar sx={{ bgcolor: deepOrange[500], mr: 2 }} id="survey-avatar">
              N
            </Avatar>
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                id="survey-question-title"
              >
                USER, {currentQuestion.question}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                id="survey-question-subtitle"
              >
                We'll recommend the right plan for you.
              </Typography>
            </Box>
          </Box>

          <FormControl component="fieldset" id="survey-options-container">
            <RadioGroup
              value={selectedOption}
              onChange={handleOptionChange}
              id="survey-options-group"
            >
              {currentQuestion.options.map((opt, idx) => (
                <FormControlLabel
                  key={idx}
                  value={opt}
                  control={<Radio id={`survey-option-radio-${idx}`} />}
                  label={opt}
                  sx={{ mb: 1 }}
                  id={`survey-option-${idx}`}
                />
              ))}
            </RadioGroup>
          </FormControl>

          <Divider sx={{ my: 2 }} id="survey-divider" />

          <Box
            textAlign="right"
            display="flex"
            justifyContent="space-between"
            id="survey-navigation-buttons"
          >
            <Button
              variant="outlined"
              disabled={step === 0}
              onClick={handleBack}
              sx={{ textTransform: "none", borderRadius: 20, px: 4 }}
              id="survey-back-button"
            >
              Back
            </Button>
            <Button
              variant="contained"
              disabled={!selectedOption}
              onClick={handleNext}
              sx={{ textTransform: "none", borderRadius: 20, px: 4 }}
              id="survey-next-button"
            >
              Next
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default PremiumSurvey;
