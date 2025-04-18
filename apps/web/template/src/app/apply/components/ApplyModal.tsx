'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Avatar,
  MenuItem,
  Box,
  Paper,
  IconButton,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud } from 'lucide-react';
import { useJobStore } from '@/app/shared/store/useJobStore';

const countryCodes = [
  { label: 'Egypt (+20)', value: '+20' },
  { label: 'United States (+1)', value: '+1' },
  { label: 'India (+91)', value: '+91' },
];

export default function ApplyModal({ job, open, onClose }: any) {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+20',
    location: 'Giza, Al Jizah, Egypt',
    title: 'Student at Cairo University',
    avatarUrl: 'https://wallpapers.com/images/hd/best-profile-pictures-itr43vvimjrze9v3.jpg',
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [isResumeUploaded, setIsResumeUploaded] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isphoneValid, setIsphoneValid] = useState(true);

  const router = useRouter();
  const applyJob = useJobStore((state) => state.applyJob);

  useEffect(() => {
    if (open) {
      fetch('http://localhost:5000/api/user')
        .then((res) => res.json())
        .then((data) => {
          setUserData((prev) => ({
            ...prev,
            name: data.name || '',
            email: data.email || '',
            phone: '',
            countryCode: '+20',
            location: `${data.location}, ${data.country}` || prev.location,
            title: `Student at ${data.entity}` || prev.title,
            avatarUrl: data.profilePhoto || prev.avatarUrl,
          }));
        });
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (resumeUrl) {
        URL.revokeObjectURL(resumeUrl);
      }
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
    try {
      const payload = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        countryCode: userData.countryCode,
        location: userData.location,
        title: userData.title,
        avatarUrl: userData.avatarUrl,
        resume: resumeFile?.name || '',
        jobId: job.id,
      };
  
      const response = await fetch('http://localhost:5000/api/submit-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      const contentType = response.headers.get('Content-Type') || '';
  
      if (!response.ok) {
        // If response is JSON
        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to submit application');
        } else {
          // Probably HTML error response
          const errorText = await response.text();
          console.error('Non-JSON error response:', errorText);
          throw new Error('Server returned non-JSON error. See console.');
        }
      }
  
      let resultMessage = 'Application submitted successfully';
      if (contentType.includes('application/json')) {
        const result = await response.json();
        resultMessage = result.message || resultMessage;
      }
  
      applyJob({ ...job, status: 'Applied' });
  
      console.log(resultMessage);
      router.push('/MyJobs');
    } catch (error) {
      console.error('Error submitting application:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to submit application: ${errorMessage}`);
    }
  };
  

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }} component="div">
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h6">Apply to {job.company}</Typography>
        </Box>
        <IconButton onClick={onClose}>
          <span>×</span>
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box mb={3}>
          <Typography variant="subtitle1">Contact info</Typography>
          <Box display="flex" alignItems="center" gap={2} mt={1}>
            <Avatar src={userData.avatarUrl} sx={{ width: 40, height: 40 }} />
            <Box>
              <Typography fontWeight={600}>{userData.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {userData.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userData.location}
              </Typography>
            </Box>
          </Box>
        </Box>

        <TextField
          fullWidth
          label="Email address*"
          value={userData.email}
          onChange={(e) => {
            const email = e.target.value;
            setUserData({ ...userData, email });
            setIsEmailValid(email === '' || (email.includes('@') && email.includes('.com')));
          }}
          margin="normal"
          error={!isEmailValid}
          helperText={!isEmailValid ? 'Please enter a valid email address.' : ''}
        />

        <TextField
          fullWidth
          label="Phone country code*"
          value={userData.countryCode}
          onChange={(e) => setUserData({ ...userData, countryCode: e.target.value })}
          margin="normal"
          select
        >
          {countryCodes.map((code) => (
            <MenuItem key={code.value} value={code.value}>
              {code.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Mobile phone number*"
          value={userData.phone}
          onChange={(e) => {
            const phone = e.target.value;
            setUserData({ ...userData, phone });
            setIsphoneValid(/^\d{11}$/.test(phone));
          }}
          margin="normal"
          error={!isphoneValid}
          helperText={!isphoneValid ? 'Phone number must be exactly 11 digits.' : ''}
        />

        <Box mt={4}>
          <Typography variant="subtitle1">Resume</Typography>
          <Typography variant="body2" color="text.secondary">
            Be sure to include an updated resume*
          </Typography>
          {isResumeUploaded ? (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderColor: '#ccc',
              }}
            >
              <Box sx={{ bgcolor: 'red', color: 'white', p: 1, borderRadius: '4px' }}>PDF</Box>
              <Box>
                <Typography fontWeight="bold">{resumeFile?.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Uploaded on {new Date().toLocaleDateString()}
                </Typography>
              </Box>
              <Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    if (resumeUrl) {
                      window.open(resumeUrl, '_blank');
                    }
                  }}
                >
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
                onClick={() => document.getElementById('resumeInput')?.click()}
              >
                Upload resume
              </Button>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                id="resumeInput"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </Box>
          )}
        </Box>

        <Box mt={2}>
          <Typography variant="body2" color="text.secondary">
            Submitting this application won’t change your LinkedIn profile.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Application powered by LinkedIn.{' '}
            <a href="#" style={{ color: '#1a73e8' }}>
              Help Center
            </a>
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Back
        </Button>
        <Button
          variant="contained"
          disabled={
            !userData.email ||
            !userData.phone ||
            !resumeFile ||
            !isEmailValid ||
            !isphoneValid
          }
          onClick={handleSubmit}
        >
          Submit application
        </Button>
      </DialogActions>
    </Dialog>
  );
}
