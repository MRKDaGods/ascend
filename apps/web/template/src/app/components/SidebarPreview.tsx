"use client";

import {
  Box,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "../stores/chatStore";

export default function SidebarPreview() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const setSelectedConversationId = useChatStore(
    (state) => state.setSelectedConversationId
  );

  const handleConversationSelect = (id: number) => {
    setSelectedConversationId(id);
    router.push("/chat");
  };

  return (
    <Box>
      {/* Toggle Button with Label */}
      {!open && (
        <Box
          sx={{
            position: "fixed",
            top: 100,
            left: 10,
            zIndex: 1300,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <IconButton onClick={() => setOpen(true)} size="large">
            <ChevronRightIcon />
          </IconButton>
          <Typography variant="caption" sx={{ mt: 0.5, color: "#555" }}>
            Chats
          </Typography>
        </Box>
      )}

      {/* Sidebar Drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        variant="temporary"
        sx={{
          zIndex: 1301,
          "& .MuiDrawer-paper": {
            width: 250,
            pt: 8,
          },
        }}
      >
        <Sidebar onSelectConversation={handleConversationSelect} />
      </Drawer>
    </Box>
  );
}
