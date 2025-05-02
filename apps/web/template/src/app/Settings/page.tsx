"use client";

import { Box } from "@mui/material";
import SettingsBar from "@/app/components/SettingsBar";
import AccountManagement from "@/app/components/AccountManagement";

export default function LinkedInSettings() {
  return (
    <Box sx={{ display: "flex", width: "100vw", minHeight: "100vh" }}>
      <SettingsBar />

      <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", ml: "16.875em" }}>
        <Box sx={{ width: "60%" }}>
          <AccountManagement />
        </Box>
      </Box>
    </Box>
  );
}
