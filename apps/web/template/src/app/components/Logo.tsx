import React from "react";
import { AppBar, Toolbar, Typography} from "@mui/material";


const Logo = () => {
  return (
    <AppBar position="static" color="inherit" elevation={0}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: { xs: "100%", md: "80%" },
          mx: { xs: 2, md: "10em" },
          px: { xs: 2, md: 0 },
          py: { xs: 1, md: 0 },
        }}
      >
        <Typography variant="h5" color="primary" fontWeight="bold">
          Linked<span style={{ backgroundColor: "#0077b5", color: "white", padding: "0.01em 0.2em", borderRadius: 4 }}>in</span>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Logo;