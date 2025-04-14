"use client";

import React from "react";
import { Box, Typography, IconButton, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArticleIcon from "@mui/icons-material/Article";

interface DocumentPreviewProps {
  fileUrl: string;
  title: string;
  onRemove?: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ fileUrl, title, onRemove }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        mt: 2,
        border: `1px solid ${isDarkMode ? "#444" : "#ccc"}`,
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
        p: 2,
        backgroundColor: isDarkMode ? "#1e1e1e" : "#f9f9f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <ArticleIcon sx={{ color: "#0a66c2" }} />
        <Box>
          <Typography
            fontWeight={600}
            fontSize="0.95rem"
            sx={{ color: theme.palette.text.primary }}
          >
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#0a66c2",
                textDecoration: "none",
                wordBreak: "break-word",
              }}
            >
              {title}
            </a>
          </Typography>
          <Typography fontSize="0.75rem" color="text.secondary">
            PDF document — click to open
          </Typography>
        </Box>
      </Box>

      {onRemove && (
        <IconButton size="small" onClick={onRemove} sx={{ color: theme.palette.text.secondary }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

export default DocumentPreview;
