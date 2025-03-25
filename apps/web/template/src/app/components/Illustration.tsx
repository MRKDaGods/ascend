import React from "react";
import Image from "next/image";
import { Box } from "@mui/material";

const Illustration = () => {
  return (
    <Box
      sx={{
        width: { xs: "100%", md: "50%" },
        height: { md: "85vh" },
        display: "flex",
        justifyContent: { xs: "center", md: "flex-end" },
        position: { md: "absolute" },
        right: { md: 0 },
        top: { md: "55%" },
        transform: { md: "translateY(-50%)" },
        mt: { xs: 0, md: 0 }, // Adjusted spacing above the image for better mobile layout
      }}
    >
      <Image
        src="/signuplock.png"
        alt="Illustration"
        width={900}
        height={800}
        style={{ width: "100%", height: "auto", objectFit: "cover" }}
      />
    </Box>
  );
};

export default Illustration;
