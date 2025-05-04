"use client";

import { Box, Button, Paper, Typography } from "@mui/material";
import { useState } from "react";
import ConnectionPreferencesDialog from "./ConnectionPreferencesDialog";

const VisibilitySettings = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Paper elevation={3} sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ px: 2, pt: 2 }}>
          Visibility of your LinkedIn activity
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: 2,
            py: 1.5,
            borderTop: "1px solid #e0e0e0",
            cursor: "pointer",
            "&:hover": { bgcolor: "action.hover" },
          }}
          onClick={() => setDialogOpen(true)}
        >
          <Box>
            <Typography fontWeight={500}>Manage active status</Typography>
            <Typography variant="body2" color="text.secondary">
              Control when people see you're active
            </Typography>
          </Box>
          <Typography variant="body2" color="primary" fontWeight="bold">
            Your Connections only
          </Typography>
        </Box>
      </Paper>

      <ConnectionPreferencesDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
};

export default VisibilitySettings;
