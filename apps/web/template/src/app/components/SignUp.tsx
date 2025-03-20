"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Footer from "./Footer";
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
} from "@mui/material";

const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:3001/SignUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Server returned an error");
      }

      const data = await response.json();
      if (data.success) {
        setSuccess(data.message);
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (err) {
      setError("Error connecting to server.");
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" minHeight="100vh" justifyContent="center" sx={{mt:-3}}>
      <Typography variant="h4" fontWeight={500} gutterBottom>
        Make the most of your professional life
      </Typography>
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <form onSubmit={handleSubmit}>
            <Typography variant="subtitle1" gutterBottom sx={{mb:-2}}>Email</Typography>
            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{height: "2em", "& .MuiInputBase-root": { height: "2em", border: "0.01em solid black" } }}
            />
            <Typography variant="subtitle1" gutterBottom sx={{mb:-2}}>Password</Typography>
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{height: "2em", "& .MuiInputBase-root": { height: "2em",  border: "0.01em solid black"  } }}
              InputProps={{
                endAdornment: (
                  <Button onClick={() => setShowPassword(!showPassword)} size="medium" sx={{ fontWeight: "bold",  textTransform: "none"  }}>
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                ),
              }}
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Keep me logged in"
              sx={{ mt: 1 }}
            />
            <Typography variant="caption" display="block" align="center" sx={{ mt: 1, mb: 2 }}>
              By clicking Agree & Join or Continue, you agree to the LinkedIn
              <Link href="#" sx={{ color: "#0a66c2", fontWeight: 500 }}> User Agreement</Link>,
              <Link href="#" sx={{ color: "#0a66c2", fontWeight: 500 }}> Privacy Policy</Link>, and
              <Link href="#" sx={{ color: "#0a66c2", fontWeight: 500 }}> Cookie Policy</Link>.
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ backgroundColor: "#0a66c2", color: "white", borderRadius: 8, py: 1.5, fontSize: "1rem", fontWeight: 600,  textTransform: "none"  }}
            >
              Agree & Join
            </Button>
          </form>
          <Box display="flex" alignItems="center" width="100%" my={2} sx={{mb:-1, mt:-1}}>
            <Box flex={1} height="1px" bgcolor="gray" />
            <Typography align="center" sx={{ my: 2 }} mx={2}>or</Typography>
            <Box flex={1} height="1px" bgcolor="gray" />
          </Box>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mb: 1,
              borderRadius: 5,
              borderColor: "black",
              color: "text.secondary",
              fontWeight: "bold",
              textTransform: "none",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"}}
            startIcon={<img src="/google.jpg" alt="Google" width={24} height={24} />}
          >
            Continue with Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            sx={{mb: 1,
              borderRadius: 5,
              borderColor: "black",
              color: "text.secondary",
              fontWeight: "bold",
              textTransform: "none",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"}}
            startIcon={<img src="/microsoft.png" alt="Microsoft" width={24} height={24} />}
          >
            Continue with Microsoft
          </Button>
          <Typography align="center" sx={{ mt: 1 }}>
            Already on LinkedIn?
            <Link href="#" sx={{ color: "#0a66c2", fontWeight: 500, ml: 1 }}>Sign in</Link>
          </Typography>
        </Paper>
      </Container>
      <Typography align="center" sx={{ mt: 2 }}>
        Looking to create a page for a business?
        <Link href="#" sx={{ color: "#0a66c2", fontWeight: 500, ml: 1 }}>Get help</Link>
      </Typography>

      <Footer />
    </Box>
  );
};

export default SignUp;
