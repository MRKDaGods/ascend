"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  Button,
  Box,
} from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  userId: number;
}

const ConnectionPreferencesDialog: React.FC<Props> = ({
  open,
  onClose,
  userId,
}) => {
  const [localPrefs, setLocalPrefs] = useState({
    allow_connection_requests: true,
    allow_messages_from: "all",
    visible_to_public: false,
    visible_to_connections: true,
    visible_to_network: false,
    show_followers: true,
  });

  const handleToggle = (key: keyof typeof localPrefs) => {
    setLocalPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSelectChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setLocalPrefs((prev) => ({
      ...prev,
      allow_messages_from: event.target.value as string,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Connection Preferences</DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <FormControlLabel
            control={
              <Switch
                checked={localPrefs.allow_connection_requests}
                onChange={() => handleToggle("allow_connection_requests")}
              />
            }
            label="Allow connection requests"
          />
          <FormControlLabel
            control={
              <Switch
                checked={localPrefs.visible_to_public}
                onChange={() => handleToggle("visible_to_public")}
              />
            }
            label="Visible to public"
          />
          <FormControlLabel
            control={
              <Switch
                checked={localPrefs.visible_to_connections}
                onChange={() => handleToggle("visible_to_connections")}
              />
            }
            label="Visible to connections"
          />
          <FormControlLabel
            control={
              <Switch
                checked={localPrefs.visible_to_network}
                onChange={() => handleToggle("visible_to_network")}
              />
            }
            label="Visible to network"
          />
          <FormControlLabel
            control={
              <Switch
                checked={localPrefs.show_followers}
                onChange={() => handleToggle("show_followers")}
              />
            }
            label="Show followers"
          />
          <Box>
            <span>Allow messages from:</span>
            <Select
              fullWidth
              value={localPrefs.allow_messages_from}
              onChange={handleSelectChange}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="connections-only">Connections only</MenuItem>
            </Select>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            console.log("🧠 Mock saved preferences:", localPrefs);
            onClose();
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConnectionPreferencesDialog;
