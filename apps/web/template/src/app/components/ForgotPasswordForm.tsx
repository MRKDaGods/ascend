import React, { useState } from "react";
import { TextField, Typography, Button, Paper, Alert, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { api } from "@/api";

const ForgotPasswordForm = () => {
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      setError("Please enter your email or phone");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      
      // Send forget password request
      await api.auth.forgetPassword(emailOrPhone);
      
      // Show success message
      setSuccess(true);
    } catch (err) {
      console.error("Password reset request failed:", err);
      setError("Failed to send password reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper
      id="forgot-password-form"
      elevation={3}
      sx={{
        padding: 4,
        borderRadius: 3,
        width: 400,
        mx: "auto",
        textAlign: "left",
        mt: -7,
      }}
    >
      <Typography id="form-title" variant="h5" fontWeight="bold" mb={2}>
        Forgot password
      </Typography>
      
      {success ? (
        <Alert id="success-alert" severity="success" sx={{ mb: 2 }}>
          Password reset link sent! Please check your email.
        </Alert>
      ) : (
        <form id="forgot-password-form-content" onSubmit={handleSubmit}>
          <TextField
            id="email-or-phone-input"
            fullWidth
            variant="outlined"
            label="Email or Phone"
            margin="normal"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            disabled={isLoading}
            error={!!error}
          />
          
          {error && <Alert id="error-alert" severity="error" sx={{ mt: 1, mb: 1 }}>{error}</Alert>}
          
          <Typography 
            id="verification-message"
            variant="body2" 
            color="black" 
            mb={2}
            sx={{ mt: 1 }}
          >
            We'll send a password reset link to this email if it matches an existing Ascend account.
          </Typography>
          
          <Button
            id="next-button"
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              bgcolor: "#0a66c2",
              borderRadius: 10,
              paddingY: 1,
              fontWeight: "bold",
              "&:hover": { bgcolor: "#004182" },
              mt: 1,
              textTransform: "none",
            }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress id="loading-spinner" size={24} color="inherit" /> : "Next"}
          </Button>
        </form>
      )}
      
      <Button
        id="back-button"
        fullWidth
        variant="text"
        sx={{
          mt: 2,
          color: "gray",
          fontWeight: "bold",
          textTransform: "none",
        }}
        onClick={() => router.push("/authen/signup")}
        disabled={isLoading}
      >
        Back
      </Button>
    </Paper>
  );
};

export default ForgotPasswordForm;
