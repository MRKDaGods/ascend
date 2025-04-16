'use client';

import {
  Snackbar,
  Alert,
  Box,
  Typography,
  Avatar,
  Link,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';
import { useJobStore } from '../store/useJobStore';
const SaveJobPopup = () => {
  const {
    savedJobPopupOpen,
    setSavedJobPopupOpen,
    postedJobId,
    companyName,
  } = useJobStore();
  const router = useRouter();

  const handleClose = () => {
    setSavedJobPopupOpen(false);
  };

  const handleViewSavedPosts = () => {
    setSavedJobPopupOpen(false);
   router.push('/ViewPost'); 
  };

  return (
    <Snackbar
      open={savedJobPopupOpen}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        icon={false}
        severity="success"
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#1e4620',
          color: 'white',
          width: '100%',
          py: 1,
          px: 2,
          minWidth: 300,
        }}
      >
        <Avatar
          sx={{
            bgcolor: '#2e7d32',
            width: 32,
            height: 32,
            fontSize: 14,
            mr: 2,
          }}
        >
          {(companyName?.charAt(0) || 'N').toUpperCase()}
        </Avatar>
        <Typography
          sx={{
            flexGrow: 1,
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          Post successful.{' '}
          <Link
            component="button"
            onClick={handleViewSavedPosts}
            underline="hover"
            sx={{ color: '#90caf9', fontWeight: 'bold', ml: 0.5 }}
          >
            View post
          </Link>
        </Typography>
        <IconButton onClick={handleClose} size="small" sx={{ color: 'white' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Alert>
    </Snackbar>
  );
};

export default SaveJobPopup;
