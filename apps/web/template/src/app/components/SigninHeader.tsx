import React from "react";
import { Typography, Box } from "@mui/material";

const SigninHeader = () => {
  return (
    <Box mt={-20}>
      <Typography variant="h5" color="primary" fontWeight="bold" id="linkedin-logo">
        Linked
        <span style={{ backgroundColor: "#0077b5", color: "white", padding: "0.01em 0.01em", borderRadius: 4 }}>
          in
        </span>
      </Typography>
    </Box>
  );
};

export default SigninHeader;
