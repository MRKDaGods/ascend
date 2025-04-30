import React from "react";
import { Typography, Box } from "@mui/material";

const SigninHeader = () => {
  return (
    <Box mt={-20} ml={-2}>
      <Box sx={{ display: "flex"}}>
        <img
        src="/logoIcon.png"
        alt="Ascend"
        style={{ height: 36, borderRadius: 6 }}
      />
      <Typography variant="h5" color="primary" fontWeight="bold">Ascend</Typography>
      </Box>
    </Box>
  );
};

export default SigninHeader;
