"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { usePreferencesModal } from "../store/usePreferencesModal";
import MainPreferencesPage from "./PreferencesViews/MainPreferencesPage";
import OpenToWorkModal from "./PreferencesViews/OpenToWorkPage";
//add more views here 

export default function PreferencesModal() {
  const { isOpen, currentView, closeModal } = usePreferencesModal();

  const renderView = () => {
    switch (currentView) {
      case "main":
        return <MainPreferencesPage />;
      case "openToWork":
        return <OpenToWorkModal open={isOpen} onClose={closeModal} onSave={() => { /* Add save logic here */ }} />;
      // Add more views here
      default:
        return <MainPreferencesPage />;
    }
  };

  return (
    <Dialog open={isOpen} onClose={closeModal} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 600,
        }}
      >
        Preferences
        <IconButton onClick={closeModal}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>{renderView()}</DialogContent>
    </Dialog>
  );
}
