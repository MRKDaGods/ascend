"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Paper,
  Box,
  Link,
  InputAdornment,
} from "@mui/material";
import { api } from "@/api";
import { loginWithGoogle } from "@/ext/auth";

const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    api.auth.register(firstName, lastName, email, password)
      .then((response: { user_id: string; email: string }) => {
        console.log("Registration successful:", response);
        alert("Registered successfully! ID: " + response.user_id + "\nEmail: " + response.email);
      })
      .catch((error: any) => {
        console.error("Registration error:", error);
        setError("An error occurred during registration. Please try again.");
      });
  };

  const handleGoogleSignIn = () => {
    loginWithGoogle().then((response) => {
      console.log("Google login successful:", response);
      alert("Logged in successfully! ID: " + 0);
      router.push("/feed");
    }).catch((error) => {
      console.error("Google login error:", error);
      setError("An error occurred during Google login. Please try again.");
    });
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" minHeight="50vh" justifyContent="center">
      <Typography sx={{color: "text.primary"}} variant="h4" fontWeight={500} gutterBottom>
        Make the most of your professional life
      </Typography>

      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <form onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <Typography color="error" data-testid="error-message" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            {/* Success Message */}
            {success && (
              <Typography color="success" data-testid="success-message" sx={{ mb: 2 }}>
                {success}
              </Typography>
            )}

            {/* Input Fields */}
            <TextField
              fullWidth
              label="First name"
              variant="outlined"
              margin="normal"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              id="first-name-input"
              sx={{
                borderRadius: 5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              fullWidth
              label="Last name"
              variant="outlined"
              margin="normal"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              id="last-name-input"
              sx={{
                borderRadius: 5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              id="email-input"
              sx={{
                borderRadius: 5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              id="password-input"
              sx={{
                borderRadius: 5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
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
            />

            <FormControlLabel
              control={<Checkbox defaultChecked id="keep-logged-in-checkbox" />}
              label="Keep me logged in"
              sx={{ mt: 1, display: "block", textAlign: "left" }}
            />

            <Typography fontSize={11} variant="caption" display="block" align="center" sx={{ mt: 1, mb: 2 }}>
              By clicking Agree & Join or Continue, you agree to the Ascend
              <Link href="#" id="user-agreement-link" sx={{ color: "#0a66c2", fontWeight: 500 }}> User Agreement</Link>,
              <Link href="#" id="privacy-policy-link" sx={{ color: "#0a66c2", fontWeight: 500 }}> Privacy Policy</Link>,and
              <Link href="#" id="cookie-policy-link" sx={{ color: "#0a66c2", fontWeight: 500 }}> Cookie Policy</Link>.
            </Typography>

            {/* Agree & Join Button - polished */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              id="agree-and-join-button"
              sx={{
                mt: 2,
                borderRadius: 5,
                fontWeight: "bold",
                textTransform: "none",
                fontSize: 16,
              }}
            >
              Agree & Join
            </Button>
          </form>

          <Box display="flex" alignItems="center" width="100%" my={2}>
            <Box flex={1} height="1px" bgcolor="gray" />
            <Typography align="center" sx={{ mx: 2 }}>or</Typography>
            <Box flex={1} height="1px" bgcolor="gray" />
          </Box>

          <Button
            fullWidth
            variant="outlined"
            id="continue-with-google-button"
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
            startIcon={<img src="/google.jpg" alt="Google" width={24} height={24} />}
            onClick={handleGoogleSignIn}
          >
            Continue with Google
          </Button>

          <Button
            fullWidth
            variant="outlined"
            id="continue-with-microsoft-button"
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
            startIcon={<img src="/microsoft.png" alt="Microsoft" width={24} height={24} />}
          >
            Continue with Microsoft
          </Button>

          <Typography align="center" sx={{ mt: 1 }}>
            Already on Ascend?
            <Link href="#" id="sign-in-link" sx={{ color: "#0a66c2", fontWeight: 500, ml: 1 }} onClick={() => router.push("/authen/signup")}>Sign in</Link>
          </Typography>
        </Paper>
      </Container>

      <Typography align="center" sx={{ mt: 2, color: "text.primary" }}>
        Looking to create a page for a business?
        <Link href="#" id="get-help-link" sx={{ color: "#0a66c2", fontWeight: 500, ml: 1 }}>Get help</Link>
      </Typography>
    </Box>
  );
};

export default SignUp;
