'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Switch,
  Button,
  Box,
  Stack,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SaveIcon from '@mui/icons-material/Save';

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
}

const ResumeApplicationDataModal = ({ open, onClose }: ResumeModalProps) => {
  // Handling file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      alert(`File uploaded: ${file.name}`);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box p={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={600}>
            Resume & Application Data
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent>
          {/* Save resumes and application data */}
          <Stack spacing={1} mb={2}>
            <Box display="flex" alignItems="center">
              <Typography fontWeight={600}>Save resumes and application data</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Allow LinkedIn to save your resumes and answers to application questions. You may
              change your answers with each application.{' '}
              <Typography
                component="span"
                color="primary"
                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                Learn more
              </Typography>
            </Typography>
            <Switch defaultChecked color="success" />
          </Stack>

          {/* Share resume data with recruiters */}
          <Stack spacing={1} mb={2}>
            <Typography fontWeight={600}>Share resume data with recruiters</Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Recruiters can view skills and experiences from your saved resumes when they search
              and view profiles.{' '}
              <Typography
                component="span"
                color="primary"
                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                Learn more
              </Typography>
            </Typography>
            <Switch color="success" />
          </Stack>

          {/* Upload resume button aligned to the right */}
          <Box display="flex" justifyContent="flex-start">
            <Button
              variant="outlined"
              startIcon={<UploadFileIcon />}
              sx={{
                borderRadius: '50px',
                textTransform: 'none',
                width: 'fit-content',
                px: 2,
                py: 1,
                fontWeight: 500,
              }}
              component="label"
            >
              Upload Resume
              <input
                type="file"
                hidden
                accept=".doc,.docx,.pdf"
                onChange={handleFileUpload}
              />
            </Button>
          </Box>
          <Typography variant="caption" display="block" color="text.secondary" mb={3}>
            DOC, DOCX, PDF (5MB)
          </Typography>

          {/* Info text with Save Icon */}
          <Box
            sx={{
              backgroundColor: '#f3f2ef',
              padding: 2,
              borderRadius: 1,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <SaveIcon sx={{ color: 'black', marginRight: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Your saved resumes allow us to improve your experience on LinkedIn.{' '}
              <Typography
                component="span"
                color="primary"
                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                Learn more
              </Typography>
            </Typography>
          </Box>
        </DialogContent>

        <Divider sx={{ mt: 2 }} />

        {/* Footer */}
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ textTransform: 'none', borderRadius: '50px', mr: 1 }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={onClose}
            sx={{ textTransform: 'none', borderRadius: '50px' }}
          >
            Done
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ResumeApplicationDataModal;
