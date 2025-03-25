import CloseAccount from "@/app/components/CloseAccount";
import SettingsBar from "@/app/components/SettingsBar"
import { Box } from "@mui/material";

export default function CloseAccountPage() {
  return(
    <Box sx={{ display: "flex", width: "100vw", minHeight: "100vh" }}>
      <SettingsBar />
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", ml: "10em" }}>
        <Box sx={{ width: "120%" ,mt:-30 }}>
          <CloseAccount username="User" />
        </Box>
      </Box>
    </Box>
  );
}
