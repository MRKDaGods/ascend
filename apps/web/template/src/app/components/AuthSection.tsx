import React from "react";
import { Box, Typography, Link } from "@mui/material";
import AuthButtons from "./AuthButtons";

const AuthSection = () => {
  return (
    <Box sx={{ maxWidth: 600, mx: "auto", textAlign: "left", position: "relative", top: "7em" }}>
      <Typography variant="h4" color="text.secondary" gutterBottom sx={{ maxWidth:700, fontSize: "clamp(2rem, 5vw, 3rem)" }}>
        Welcome to your professional community
      </Typography>
      <AuthButtons />
      <Typography variant="body2" color="text.secondary" mt={2}
        sx={{textAlign: "center", position: "relative",maxWidth:400 }}>
        By clicking Continue to join or sign in, you agree to LinkedIn's
        <Link href="#" sx={{ ml: 0.5 }}> User Agreement</Link>,
        <Link href="#" sx={{ ml: 0.5 }}> Privacy Policy</Link>, and
        <Link href="#" sx={{ ml: 0.5 }}> Cookie Policy</Link>.
      </Typography>
      <Typography mt={2}
        sx={{textAlign: "center", position: "relative",maxWidth:400 }}>
        New to LinkedIn? <Link href="#">Join now</Link>
      </Typography>
    </Box>
  );
};

export default AuthSection;