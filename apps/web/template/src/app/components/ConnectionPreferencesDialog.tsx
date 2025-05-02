"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Button,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useConnectionStore } from "../stores/useConnectionStore";
import { ConnectionPreferences } from "@/api/connections";

const ConnectionPreferencesDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { connectionPreferences, saveConnectionPreferences } = useConnectionStore();
  const [form, setForm] = useState<ConnectionPreferences>({
    allow_connection_requests: true,
    allow_messages_from: "all",
    visible_to_public: true,
    visible_to_connections: true,
    visible_to_network: true,
    show_followers: true,
  });

  useEffect(() => {
    if (connectionPreferences) {
      setForm(connectionPreferences);
    }
  }, [connectionPreferences]);

  const handleChange = (key: keyof ConnectionPreferences, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    await saveConnectionPreferences(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Connection Preferences</DialogTitle>
      <DialogContent sx={{ display: "grid", gap: 2, mt: 1 }}>
        <FormControlLabel
          control={
            <Switch
              checked={form.allow_connection_requests}
              onChange={(e) => handleChange("allow_connection_requests", e.target.checked)}
            />
          }
          label="Allow connection requests"
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.visible_to_public}
              onChange={(e) => handleChange("visible_to_public", e.target.checked)}
            />
          }
          label="Visible to public"
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.visible_to_connections}
              onChange={(e) => handleChange("visible_to_connections", e.target.checked)}
            />
          }
          label="Visible to connections"
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.visible_to_network}
              onChange={(e) => handleChange("visible_to_network", e.target.checked)}
            />
          }
          label="Visible to network"
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.show_followers}
              onChange={(e) => handleChange("show_followers", e.target.checked)}
            />
          }
          label="Show followers"
        />
        <Typography variant="body2">Allow messages from:</Typography>
        <Select
          size="small"
          value={form.allow_messages_from}
          onChange={(e) => handleChange("allow_messages_from", e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="connections-only">Connections Only</MenuItem>
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConnectionPreferencesDialog;
