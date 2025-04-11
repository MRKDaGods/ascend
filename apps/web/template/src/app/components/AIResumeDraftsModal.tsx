'use client';

import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Button,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface AIResumeDraftsModalProps {
  open: boolean;
  onClose: () => void;
}

const AIResumeDraftsModal = ({ open, onClose }: AIResumeDraftsModalProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" px={2} pt={2}>
        <Typography fontWeight={600} fontSize={18}>
          AI-powered resume drafts
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ textAlign: 'center', pb: 1 }}>
        {/* Paragraph */}
        <Typography variant="body2" color="text.secondary" mt={1.5} mb={2.5}>
          These are resumes created from jobs you viewed and are{' '}
          <strong>private to you</strong>. To create a new resume, open a job and select{' '}
          <strong>Tailor my resume</strong>.
        </Typography>

        {/* Illustration */}
        <Box display="flex" justifyContent="center" mb={2}>
          <img
            src="/ai-resume-illustration.png" // Replace with your actual illustration path
            alt="No resume drafts"
            style={{ width: '180px', opacity: 0.9 }}
          />
        </Box>

        {/* No drafts message */}
        <Typography fontWeight={600} fontSize={16}>
          No resume drafts
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Your tailored resumes drafts created with AI will appear here
        </Typography>
      </DialogContent>

      {/* Footer */}
      <Box display="flex" justifyContent="flex-end" px={2} pb={2}>
        <Button
          variant="outlined"
          sx={{ textTransform: 'none', borderRadius: 10, mr: 1, minWidth: 80 }}
          onClick={onClose}
        >
          Back
        </Button>
        <Button
          variant="contained"
          sx={{ textTransform: 'none', borderRadius: 10, minWidth: 80 }}
          onClick={onClose}
        >
          Done
        </Button>
      </Box>
    </Dialog>
  );
};

export default AIResumeDraftsModal;
