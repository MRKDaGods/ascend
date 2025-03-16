import React from "react";
import { Box, TextField, Typography, Button, Paper } from "@mui/material";

const ForgotPasswordForm = () => {
  return (
    <Paper
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
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Forgot password
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Email or Phone"
        margin="normal"
      />
        
        <Typography variant="body2" color="black" mb={2}
         sx={{mt: 1,}} >
        We’ll send a verification code to this email or phone number if it matches an existing LinkedIn account.
      </Typography>
      <Button
        fullWidth
        variant="contained"
        sx={{
          bgcolor: "#0a66c2",
          borderRadius: 10,
          paddingY: 1,
          fontWeight: "bold",
          "&:hover": { bgcolor: "#004182" },
          mt: 1,
        }}
      >
        Next
      </Button>
      <Button
        fullWidth
        variant="text"
        sx={{
          mt: 2,
          color: "gray",
          fontWeight: "bold",
        }}
      >
        Back
      </Button>
    </Paper>
  );
};

export default ForgotPasswordForm;
