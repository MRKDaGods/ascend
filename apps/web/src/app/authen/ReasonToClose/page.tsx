"use client";

import ReasonToClose from "@/app/components/ReasonToClose";
import SettingsBar from "@/app/components/SettingsBar"
import { Box } from "@mui/material";

export default function ReasonToClosePage() {
  return(
    <Box sx={{ display: "flex", width: "100vw", minHeight: "100vh" }}>
      <SettingsBar />
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", ml: "10em" }}>
        <Box sx={{ width: "120%" ,mt:-30 }}>
          <ReasonToClose username="User"/>
        </Box>
      </Box>
    </Box>
  );
}
