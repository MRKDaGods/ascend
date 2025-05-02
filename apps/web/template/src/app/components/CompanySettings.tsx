"use client";

import React, { useState } from "react";
import { Box, Typography, Paper, Button, Checkbox, FormControlLabel, Divider } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCompanyStore } from "@/app/stores/useCreateCompanyStore";
import LanguageIcon from "@mui/icons-material/Language";
import SearchIcon from "@mui/icons-material/Search";
import BadgeIcon from "@mui/icons-material/Badge";

export default function DeactivatePageModal() {
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);
  const router = useRouter();
  const deleteCompanyProfile = useCompanyStore((state) => state.deleteCompanyProfile);

  const handleDeactivate = async () => {
    if (!confirmDeactivate) return;

    try {
      await deleteCompanyProfile(); // ✅ Calls the real API
      router.push("/CreateCompanyPage/Company"); // ✅ Redirects after deletion
    } catch (err) {
      console.error("❌ Failed to delete company:", err);
      alert("An error occurred while deleting the company.");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, width: '80%' }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Deactivate Page
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        We’re sorry to see you go
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={3}>
        Deactivating will remove the page entirely from LinkedIn. Once deactivated, you and other admins will no longer have access to the Page.
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
        You and other admins will lose access to...
      </Typography>

      <Box display="flex" alignItems="center" mb={2}>
        <LanguageIcon color="action" sx={{ fontSize: 32, mr: 2 }} />
        <Box>
          <Typography variant="body1" fontWeight="bold">Page URL</Typography>
          <Typography variant="body2" color="text.secondary">
            This URL will not be able to be repurposed for a new Page.
          </Typography>
        </Box>
      </Box>

      <Box display="flex" alignItems="center" mb={2}>
        <SearchIcon color="action" sx={{ fontSize: 32, mr: 2 }} />
        <Box>
          <Typography variant="body1" fontWeight="bold">Search listings</Typography>
          <Typography variant="body2" color="text.secondary">
            This Page will no longer be listed on search results on LinkedIn.
          </Typography>
        </Box>
      </Box>

      <Box display="flex" alignItems="center" mb={3}>
        <BadgeIcon color="action" sx={{ fontSize: 32, mr: 2 }} />
        <Box>
          <Typography variant="body1" fontWeight="bold">Employee associations</Typography>
          <Typography variant="body2" color="text.secondary">
            All existing employee associations for this Page will be removed.
          </Typography>
        </Box>
      </Box>

      <FormControlLabel
        control={
          <Checkbox
            checked={confirmDeactivate}
            onChange={(e) => setConfirmDeactivate(e.target.checked)}
          />
        }
        label="By clicking Deactivate, I confirm that I understand the implications of deactivating the Page."
        sx={{ mb: 3 }}
      />

      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Button
          variant="contained"
          color="error"
          disabled={!confirmDeactivate}
          onClick={handleDeactivate}
        >
          Delete
        </Button>
      </Box>
    </Paper>
  );
}
