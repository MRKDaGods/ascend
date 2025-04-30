"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  TextField,
  Typography,
  InputAdornment,
  Alert,
} from "@mui/material";
import { api } from "@/api";

export default function LoginBox() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleResendConfirmation = async () => {
    if (!email || !validateEmail(email)) {
      setError("Please enter a valid email address to resend confirmation.");
      return;
    }

    setIsResending(true);
    try {
      await api.auth.resendConfirmationEmail(email);
      setResendSuccess(true);
      setNeedsConfirmation(false);
      setError("");
    } catch (error) {
      console.error("Error resending confirmation email:", error);
      setError("Failed to resend confirmation email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNeedsConfirmation(false);
    setResendSuccess(false);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 3) {
      // Adjusted to 3 for demo purposes, change to 8 for production
      setError("Password must be at least 3 characters long.");
      return;
    }

    // Call the API to sign in
    api.auth
      .login(email, password)
      .then((response: { token: string; user_id: number }) => {
        console.log("Login successful:", response);
        localStorage.setItem("access_token", response.token);
        router.push("/feed");
      })
      .catch((error: any) => {
        console.error("Login error:", error);

        // Check if the error is a 403 Forbidden (email not confirmed)
        if (
          error &&
          (error.includes("403") ||
            error.toLowerCase().includes("confirm") ||
            error.toLowerCase().includes("verification"))
        ) {
          setNeedsConfirmation(true);
        } else {
          setError("An error occurred during login. Please try again.");
        }
      });
  };

  if (!mounted) return null; // Prevents mismatch by rendering only on the client

  return (
    <>
      <Box
        sx={{
          p: 4,
          borderRadius: 3,
          boxShadow: 3,
          width: 380,
          bgcolor: "background.paper",
          position: "absolute",
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          mb={2}
          sx={{ textAlign: "left", color: "text.primary" }}
          id="login-title"
        >
          Sign in
        </Typography>

        {error && (
          <Typography color="error" fontSize={14} mb={2}>
            {error}
          </Typography>
        )}

        {needsConfirmation && (
          <Alert
            severity="warning"
            sx={{
              mb: 2,
              "& .MuiAlert-message": {
                width: "100%",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography fontSize={14} align="center" sx={{ mb: 1 }}>
                Your email is not confirmed yet.
                <br />
                Please check your inbox or:
              </Typography>
              <Button
                color="primary"
                onClick={handleResendConfirmation}
                disabled={isResending}
                variant="outlined"
                size="small"
                sx={{
                  textTransform: "none",
                  fontWeight: "medium",
                  minWidth: "200px",
                }}
              >
                {isResending ? "Sending..." : "Resend confirmation email"}
              </Button>
            </Box>
          </Alert>
        )}

        {resendSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography fontSize={14} align="center">
              Confirmation email sent successfully! Please check your inbox.
            </Typography>
          </Alert>
        )}

        {/* Google Sign-in Button */}
        <Button
          fullWidth
          variant="outlined"
          sx={{
            mb: 1,
            borderRadius: 5,
            borderColor: "black",
            color: "text.secondary",
            fontWeight: "bold",
            textTransform: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="/google.jpg"
            alt="Google"
            width={20}
            height={20}
            style={{ marginRight: 8 }}
          />
          Continue as User
        </Button>

        {/* Apple Sign-in Button */}
        <Button
          fullWidth
          variant="outlined"
          sx={{
            mb: 2,
            borderRadius: 5,
            fontWeight: "bold",
            textTransform: "none",
            borderColor: "black",
            color: "text.secondary",
          }}
        >
          🍏 Sign in with Apple
        </Button>

        <Divider sx={{ my: 2, color: "text.primary" }}>or</Divider>

        {/* Form Fields */}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email or phone"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ borderRadius: 5 }}
            id="email-input"
          />

          {/* Password Field with "Show / Hide" Toggle */}
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ borderRadius: 5 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography
                    sx={{
                      cursor: "pointer",
                      color: "primary.main",
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Typography>
                </InputAdornment>
              ),
            }}
            id="password-input"
          />

          {/* Forgot Password */}
          <Button
            color="primary"
            sx={{
              cursor: "pointer",
              fontSize: 14,
              textAlign: "left",
              mt: 1,
              display: "flex",
              justifyContent: "flex-start",
              textTransform: "none",
            }}
            onClick={() => router.push("/authen/ForgetPassword")}
            id="forgot-password-link"
          >
            Forgot password?
          </Button>

          {/* Keep Me Logged In (Now Below Forgot Password) */}
          <FormControlLabel
            control={<Checkbox id="keep-logged-in-checkbox" />}
            label="Keep me logged in"
            sx={{
              display: "block",
              textAlign: "left",
              mt: 1,
              color: "text.primary",
            }}
          />

          {/* Sign In Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              mt: 2,
              borderRadius: 5,
              fontWeight: "bold",
              textTransform: "none",
              fontSize: 16,
            }}
            id="sign-in-button"
          >
            Sign in
          </Button>
        </form>
      </Box>

      {/* Join Now (Moved Below the Box) */}
      <Typography
        fontSize={14}
        sx={{
          position: "absolute",
          top: "calc(85%)",
          left: "50%",
          transform: "translateX(-50%)",
          color: "text.primary",
        }}
      >
        New to Ascend?{" "}
        <Typography
          component="a"
          href="#"
          color="primary"
          sx={{ fontWeight: "bold" }}
          onClick={() => router.push("/authen/NewToLinkedin")}
          id="join-now-link"
        >
          Join now
        </Typography>
      </Typography>
    </>
  );
}
