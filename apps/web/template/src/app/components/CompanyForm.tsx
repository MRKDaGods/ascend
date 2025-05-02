'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, TextField, Typography, Button,
  Checkbox, FormControlLabel, Card, CardContent,
} from '@mui/material';
import { useCompanyStore } from '@/app/stores/useCreateCompanyStore';

const CompanyForm = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    companyId,
    fetchCompanyProfile,
    createCompanyProfile,
    name, industry, location, description, domainName,
    profileImage, coverImage, logoFile, coverFile,
    setCompanyInfo,
  } = useCompanyStore();

  useEffect(() => {
    if (companyId) {
      fetchCompanyProfile(companyId);
    }
  }, [companyId, fetchCompanyProfile]);

  const isFormValid = () =>
    name && domainName && industry && location && description && logoFile && coverFile && isChecked;

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      convertToBase64(file).then((base64) => {
        setCompanyInfo({
          profileImage: base64,
          logoFile: file,
        });
      }).catch((error) => console.error("Error converting logo to base64:", error));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      convertToBase64(file).then((base64) => {
        setCompanyInfo({
          coverImage: base64,
          coverFile: file,
        });
      }).catch((error) => console.error("Error converting cover to base64:", error));
    }
  };

  const handleSubmit = async () => {
    if (!logoFile || !coverFile) return;
    setIsSubmitting(true);

    try {
      const createdCompany = await createCompanyProfile();
      setCompanyInfo({
        profileImage: createdCompany.profile_photo_url,
        coverImage: createdCompany.cover_photo_url,
      });
      router.push("/CreateCompanyPage/Company/CompanyPageItself");
    } catch (err) {
      console.error('Submission Error:', err);
      alert('Failed to create company profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (name) {
      const generatedDomain = name.trim().toLowerCase().replace(/\s+/g, '');
      const generatedUrl = `Ascend.com/company/${generatedDomain}`;
      setCompanyInfo({ domainName: generatedDomain });
    }
  }, [name, setCompanyInfo]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '100%' }}>
      <Card sx={{ maxWidth: 550, margin: 'auto' }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            * indicates required
          </Typography>

          <TextField
            label="Name"
            required
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setCompanyInfo({ name: e.target.value })}
          />

          <TextField
            label="Domain Name"
            required
            fullWidth
            margin="normal"
            value={domainName}
            onChange={(e) => setCompanyInfo({ domainName: e.target.value })}
          />

          <TextField
            label="Industry"
            required
            fullWidth
            margin="normal"
            value={industry}
            onChange={(e) => setCompanyInfo({ industry: e.target.value })}
          />

          <TextField
            label="Location"
            required
            fullWidth
            margin="normal"
            value={location}
            onChange={(e) => setCompanyInfo({ location: e.target.value.slice(0, 50) })}
            inputProps={{ maxLength: 50 }}
            sx={{ mb: 3 }}
          />

          <TextField
            label="Description"
            required
            fullWidth
            multiline
            maxRows={4}
            value={description}
            onChange={(e) => setCompanyInfo({ description: e.target.value })}
            inputProps={{ maxLength: 200 }}
            helperText="Briefly describe your organization."
          />

          <Box sx={{ border: '1px dashed #ccc', p: 3, textAlign: 'center', my: 2 }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              style={{ display: 'none' }}
              id="logo-upload"
            />
            <label htmlFor="logo-upload">
              <Button variant="outlined" component="span">Choose Profile Image</Button>
            </label>
            {profileImage && (
              <Box mt={2}>
                <img src={profileImage} alt="Profile preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8 }} />
              </Box>
            )}
          </Box>

          <Box sx={{ border: '1px dashed #ccc', p: 3, textAlign: 'center', my: 2 }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              style={{ display: 'none' }}
              id="cover-upload"
            />
            <label htmlFor="cover-upload">
              <Button variant="outlined" component="span">Choose Cover Image</Button>
            </label>
            {coverImage && (
              <Box mt={2}>
                <img src={coverImage} alt="Cover preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8 }} />
              </Box>
            )}
          </Box>

          <FormControlLabel
            control={<Checkbox checked={isChecked} onChange={() => setIsChecked(!isChecked)} />}
            label="I verify I am an authorized representative."
            sx={{ mt: 2 }}
          />

          <Button
            variant="contained"
            disabled={!isFormValid() || isSubmitting}
            sx={{ mt: 2 }}
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Submitting...' : 'Create Page'}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CompanyForm;
