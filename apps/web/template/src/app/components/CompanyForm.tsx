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
    name, url, industry, location, description, domainName, profileImage, coverImage, logoFile, coverFile,
    setCompanyInfo,
  } = useCompanyStore();

  useEffect(() => {
    if (companyId) {
      fetchCompanyProfile(companyId);
    }
  }, [companyId, fetchCompanyProfile]);

  const isFormValid = () =>
    name && url && domainName && industry && location && description && logoFile && coverFile && isChecked;

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!(file instanceof File)) {
        return reject(new Error("Provided input is not a valid File instance."));
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file instanceof File) {
      convertToBase64(file).then((base64) => {
        setCompanyInfo({
          profileImage: `data:${file.type};base64,${base64}`,
          logoFile: file,
        });
      }).catch((error) => console.error("Error converting logo to base64:", error));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file instanceof File) {
      convertToBase64(file).then((base64) => {
        setCompanyInfo({
          coverImage: `data:${file.type};base64,${base64}`,
          coverFile: file,
        });
      }).catch((error) => console.error("Error converting cover to base64:", error));
    }
  };

  const handleSubmit = async () => {
    if (!logoFile || !coverFile) return;
    setIsSubmitting(true);

    try {
      await createCompanyProfile();
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
      setCompanyInfo({ domainName: generatedDomain, url: generatedUrl });
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
            <Typography variant="body2" mt={1}>Profile image preview</Typography>
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
            <Typography variant="body2" mt={1}>Cover image preview</Typography>
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
