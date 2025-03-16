import React from "react";
import { Box } from "@mui/material";
import SigninHeader from "@/app/components/SigninHeader"; 
import SigninBox from "@/app/components/SigninBox"; 
import Footer from "@/app/components/Footer"; 

const SigninPage = () => {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh" 
      bgcolor="white"
    >
      <SigninHeader />
      <SigninBox />
      <Footer />
    </Box>
  );
};

export default SigninPage;
