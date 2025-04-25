'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  IconButton,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud } from 'lucide-react';
import { useJobStore } from '@/app/shared/store/useJobStore';

export default function ApplyModal({ job, open, onClose }: any) {
  const [userData, setUserData] = useState({
    email: '',
    fullPhone: '',
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [isResumeUploaded, setIsResumeUploaded] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();
  const applyJob = useJobStore((state) => state.applyJob);

  useEffect(() => {
    if (open) {
      fetch('http://localhost:5000/api/user')
        .then((res) => res.json())
        .then((data) => {
          setUserData((prev) => ({
            ...prev,
            email: data.email || '',
            fullPhone: '',
          }));
        });
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (resumeUrl) URL.revokeObjectURL(resumeUrl);
    };
  }, [resumeUrl]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      setResumeUrl(URL.createObjectURL(file));
      setIsResumeUploaded(true);
    }
  };

  const handleSubmit = async () => {
    if (!resumeFile) {
      alert('Please upload your resume.');
      return;
    }

    if (!userData.email || !userData.fullPhone) {
      alert('Please fill in all required fields.');
      return;
    }

    if (!job?.id) {
      alert('Job ID is missing.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile, resumeFile.name);
      formData.append('email', userData.email.trim());
      formData.append('phone', userData.fullPhone.trim());
      console.log('************');
      console.log('FormData:', userData.fullPhone.trim()); // Debugging line
      const response = await fetch(`https://api.ascendx.tech/job/apply/${job.id}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzQ1NTQxNDI2LCJleHAiOjE3NDU1ODQ2MjZ9.CeDVIEjn9-hbKAdmITfZCzs6v0g3R-419BryMYp4GKw',
        'x-no-parse-body': '1'
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`(${response.status}) ${errorText}`);
      }

      const result = await response.json();
      applyJob({ ...job, status: 'Applied' });
      alert(result.message);
      router.push('/MyJobs');
    } catch (error) {
      console.error('Application error:', error);
      alert(`Application failed: ${(error as Error).message}`);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h6">Apply to {job.company}</Typography>
        </Box>
        <IconButton onClick={onClose}><span>×</span></IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <TextField
          fullWidth
          label="Email address*"
          value={userData.email}
          onChange={(e) => {
            const email = e.target.value;
            setUserData({ ...userData, email });
            setIsEmailValid(email === '' || (email.includes('@') && email.includes('.')));
          }}
          margin="normal"
          error={!isEmailValid}
          helperText={!isEmailValid ? 'Invalid email format.' : ''}
        />

        <TextField
          fullWidth
          label="Mobile phone number*"
          placeholder="+201234567890"
          value={userData.fullPhone}
          onChange={(e) => {
            const phone = e.target.value;
            setUserData({ ...userData, fullPhone: phone });
            setIsPhoneValid(/^\+\d{10,15}$/.test(phone));
          }}
          margin="normal"
          error={!isPhoneValid}
          helperText={!isPhoneValid ? 'Use format +201234567890 (10–15 digits).' : ''}
        />

        <Box mt={4}>
          <Typography variant="subtitle1">Resume</Typography>
          <Typography variant="body2" color="text.secondary">
            Please upload your updated resume.
          </Typography>
          {isResumeUploaded ? (
            <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ bgcolor: 'red', color: 'white', p: 1, borderRadius: '4px' }}>PDF</Box>
              <Box>
                <Typography fontWeight="bold">{resumeFile?.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Uploaded on {new Date().toLocaleDateString()}
                </Typography>
              </Box>
              <Box>
                <Button variant="outlined" size="small" onClick={() => resumeUrl && window.open(resumeUrl, '_blank')}>
                  View
                </Button>
              </Box>
            </Paper>
          ) : (
            <Box>
              <Button
                variant="outlined"
                startIcon={<UploadCloud size={18} />}
                sx={{ mt: 1 }}
                onClick={() => fileInputRef.current?.click()}
              >
                Upload resume
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                id="resumeInput"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">Back</Button>
        <Button
          variant="contained"
          disabled={
            !userData.email ||
            !userData.fullPhone ||
            !resumeFile ||
            !isEmailValid ||
            !isPhoneValid
          }
          onClick={handleSubmit}
        >
          Submit application
        </Button>
      </DialogActions>
    </Dialog>
  );
}
