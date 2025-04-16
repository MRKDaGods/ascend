import React from "react";
import { Box, Container } from "@mui/material";

const HomePage = () => {
  return (
    <Box sx={{ bgcolor: "white", minHeight: "100vh" }}>
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column-reverse", md: "row" },
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 2, md: 4 },
            px: { xs: 2, md: 0 },
            mt: { xs: 2, md: 0 }
          }}
        >
          <p>Hello Nour! Here you can create Premium Plan Module. Good luck!</p>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
