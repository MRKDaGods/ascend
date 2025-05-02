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
    <Paper id="company-settings-container" elevation={3} sx={{ p: 4, width: '80%' }}>
      <Typography id="deactivate-page-title" variant="h5" fontWeight="bold" gutterBottom>
        Deactivate Page
      </Typography>

      <Typography id="deactivate-page-subtitle" variant="subtitle1" color="text.secondary" gutterBottom>
        We’re sorry to see you go
      </Typography>

      <Typography id="deactivate-page-description" variant="body2" color="text.secondary" mb={3}>
        Deactivating will remove the page entirely from LinkedIn. Once deactivated, you and other admins will no longer have access to the Page.
      </Typography>

      <Divider id="deactivate-page-divider" sx={{ mb: 3 }} />

      <Typography id="deactivate-page-implications-title" variant="subtitle2" fontWeight="bold" gutterBottom>
        You and other admins will lose access to...
      </Typography>

      <Box id="deactivate-page-url" display="flex" alignItems="center" mb={2}>
        <LanguageIcon id="url-icon" color="action" sx={{ fontSize: 32, mr: 2 }} />
        <Box>
          <Typography id="url-title" variant="body1" fontWeight="bold">Page URL</Typography>
          <Typography id="url-description" variant="body2" color="text.secondary">
            This URL will not be able to be repurposed for a new Page.
          </Typography>
        </Box>
      </Box>

      <Box id="deactivate-page-search" display="flex" alignItems="center" mb={2}>
        <SearchIcon id="search-icon" color="action" sx={{ fontSize: 32, mr: 2 }} />
        <Box>
          <Typography id="search-title" variant="body1" fontWeight="bold">Search listings</Typography>
          <Typography id="search-description" variant="body2" color="text.secondary">
            This Page will no longer be listed on search results on LinkedIn.
          </Typography>
        </Box>
      </Box>

      <Box id="deactivate-page-employee-associations" display="flex" alignItems="center" mb={3}>
        <BadgeIcon id="employee-icon" color="action" sx={{ fontSize: 32, mr: 2 }} />
        <Box>
          <Typography id="employee-title" variant="body1" fontWeight="bold">Employee associations</Typography>
          <Typography id="employee-description" variant="body2" color="text.secondary">
            All existing employee associations for this Page will be removed.
          </Typography>
        </Box>
      </Box>

      <FormControlLabel
        id="deactivate-confirm-checkbox"
        control={
          <Checkbox
            id="confirm-deactivate-checkbox"
            checked={confirmDeactivate}
            onChange={(e) => setConfirmDeactivate(e.target.checked)}
          />
        }
        label="By clicking Deactivate, I confirm that I understand the implications of deactivating the Page."
        sx={{ mb: 3 }}
      />

      <Box id="deactivate-page-actions" display="flex" justifyContent="flex-end" gap={2}>
        <Button
          id="deactivate-page-delete-button"
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
