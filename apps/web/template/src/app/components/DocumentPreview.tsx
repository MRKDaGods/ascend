"use client";

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// setup worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface DocumentPreviewProps {
  fileUrl: string;
  title: string;
  onRemove?: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ fileUrl, title, onRemove }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <Box sx={{ position: "relative", mt: 2, borderRadius: 2, overflow: "hidden" }}>
      {/* Header */}
      <Box sx={{ backgroundColor: "#2c2c2c", color: "white", px: 2, py: 1, display: "flex", alignItems: "center" }}>
        <Typography fontWeight="bold" fontSize="0.9rem" sx={{ flex: 1 }}>
          {title} {numPages ? `• ${numPages} pages` : ""}
        </Typography>
        {onRemove && (
          <IconButton size="small" onClick={onRemove} sx={{ color: "white" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* PDF Preview */}
      <Box sx={{ backgroundColor: "#f0f0f0", textAlign: "center" }}>
        <Document
          file={fileUrl}
          onLoadSuccess={handleDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber} width={600} />
        </Document>

        {/* Pagination */}
        {numPages && numPages > 1 && (
          <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            py: 1,
            backgroundColor: "#2c2c2c",
            color: "white",
          }}>
            <IconButton
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber((prev) => prev - 1)}
              size="small"
              sx={{ color: "white" }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
            <Typography fontSize="0.75rem">{pageNumber} / {numPages}</Typography>
            <IconButton
              disabled={pageNumber >= numPages}
              onClick={() => setPageNumber((prev) => prev + 1)}
              size="small"
              sx={{ color: "white" }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DocumentPreview;
