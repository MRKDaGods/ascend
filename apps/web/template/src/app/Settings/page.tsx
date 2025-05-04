"use client";

import { Box, Container } from "@mui/material";
import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import SettingsBar from "@/app/components/SettingsBar";
import AccountManagement from "@/app/components/AccountManagement";
import BlockedUsers from "@/app/components/BlockedUsers";
import Navbar from "@/app/components/Navbar";
import VisibilitySettings from "@/app/components/VisibilitySettings";

export default function SettingsPage() {
  const theme = useTheme();
  const [selectedSection, setSelectedSection] = useState("Account preferences");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Navbar />

      <Box sx={{ display: "flex", pt: "60px" }}>
        {/* Sidebar */}
        <SettingsBar
          onSectionSelect={setSelectedSection}
          selectedSection={selectedSection}
        />

        {/* Content Area */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-start",
            pl: "16.875em", // Matches sidebar width
            pt: 5,
            pb: 5,
          }}
        >
          <Container
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              width: "100%",
              maxWidth: "500px",
              px: { xs: 2, sm: 3 },
              mt: 5,
            }}
          >
            {selectedSection === "Account preferences" && <AccountManagement />}
            {selectedSection === "Visibility" && (
              <>
                <BlockedUsers />
                {/* <VisibilitySettings /> */}
              </>
            )}
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
