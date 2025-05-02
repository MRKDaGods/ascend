"use client";

import { useState } from "react";
import { Button } from "@mui/material";
import ConnectDialog from "./ConnectDialog";
import SentConnectionRequest from "./SentConnectionRequest";
import { useConnectionStore } from "../stores/useConnectionStore";

interface ConnectionUIProps {
  userId: number;
}

const ConnectionUI: React.FC<ConnectionUIProps> = ({ userId }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const { sendConnectionRequest } = useConnectionStore();

  const handleSend = async (message: string) => {
    await sendConnectionRequest({ userId, message });
    setPopupOpen(true);
  };

  return (
    <>
      {/* Trigger Button */}
      <Button onClick={() => setDialogOpen(true)} variant="outlined">
        Connect
      </Button>

      {/* Connection Dialog */}
      <ConnectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSend={handleSend}
      />

      {/* Success Snackbar */}
      <SentConnectionRequest open={popupOpen} onClose={() => setPopupOpen(false)} />
    </>
  );
};

export default ConnectionUI;
