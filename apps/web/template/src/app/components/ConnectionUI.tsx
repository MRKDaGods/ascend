"use client";

import { useEffect, useState } from "react";
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

  const {
    sendConnectionRequest,
    fetchConnectionStatus,
    connectionStatuses,
  } = useConnectionStore();

  const status = connectionStatuses[userId];

  useEffect(() => {
    if (!status) {
      fetchConnectionStatus(userId);
    }
  }, [userId, status, fetchConnectionStatus]);

  const handleSend = async (message: string) => {
    await sendConnectionRequest({ userId, message });
    setPopupOpen(true);
  };

  const renderButton = () => {
    if (status === "connected") {
      return (
        <Button variant="contained" disabled>
          Connected
        </Button>
      );
    }

    if (status === "pending") {
      return (
        <Button variant="outlined" disabled>
          Pending
        </Button>
      );
    }

    // Default: notConnected or undefined (fallback)
    return (
      <Button onClick={() => setDialogOpen(true)} variant="outlined">
        Connect
      </Button>
    );
  };

  return (
    <>
      {renderButton()}

      <ConnectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSend={handleSend}
      />

      <SentConnectionRequest open={popupOpen} onClose={() => setPopupOpen(false)} />
    </>
  );
};

export default ConnectionUI;
