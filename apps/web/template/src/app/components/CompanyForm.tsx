'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, TextField, Typography, MenuItem, Button,
  Checkbox, FormControlLabel, Card, CardContent,
} from '@mui/material';
import { useCompanyStore } from '@/app/stores/useCreateCompanyStore';

const sizes = ['1-10', '11-50', '51-200', '201-500', '500+'];
const types = ['Public', 'Private', 'Non-profit'];

const CompanyForm = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [logo, setLogoFile] = useState<File | null>(null);
  const [cover, setCoverFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    name, url, website, industry, size, type, tagline, location, description,
    setCompanyInfo,
  } = useCompanyStore();

  const isFormValid = () =>
    name && url && industry && tagline && location && description && logo && cover && isChecked;

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
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
    const file = e.target.files?.[0] || null;
    if (file) {
      setLogoFile(file);  // Store the file locally
      convertToBase64(file).then((base64) => {
        setCompanyInfo({ profileImage: `data:${file.type};base64,${base64}` }); // Store base64 in Zustand
      });
    }
  };

  const handleSubmit = async () => {
    if (!logo || !cover) return;
    setIsSubmitting(true);
    try {
      const [base64Logo, base64Cover] = await Promise.all([ 
        convertToBase64(logo), 
        convertToBase64(cover) 
      ]);

      const profilePhoto = {
        buffer: base64Logo,
        file_name: logo.name,
        file_size: logo.size,
        mime_type: logo.type,
      };

      const coverPhoto = {
        buffer: base64Cover,
        file_name: cover.name,
        file_size: cover.size,
        mime_type: cover.type,
      };

      setCompanyInfo({
        profileImage: `data:${logo.type};base64,${base64Logo}`,
        coverImage: `data:${cover.type};base64,${base64Cover}`,
      });

      const payload = {
        name: name.trim().slice(0, 50),
        description: description.trim(),
        industry: industry.trim().slice(0, 50),
        location: location.trim().slice(0, 50),
        profile_photo: profilePhoto,
        cover_photo: coverPhoto,
      };

      console.log('Mock Payload Sent:', payload);
      await new Promise((res) => setTimeout(res, 1000));
      router.push('/CompanyPageItself');
    } catch (err) {
      console.error('Submission Error:', err);
      alert('Failed to submit.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            label="linkedin.com/company/"
            required
            fullWidth
            margin="normal"
            value={url}
            onChange={(e) => setCompanyInfo({ url: e.target.value })}
          />
          <Typography sx={{ mb: 2, mt: 1 }} color="primary">
            Learn more about the Page Public URL
          </Typography>

          <TextField
            label="Website"
            fullWidth
            margin="normal"
            value={website}
            onChange={(e) => setCompanyInfo({ website: e.target.value })}
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
            select
            label="Organization size"
            fullWidth
            required
            margin="normal"
            value={size}
            onChange={(e) => setCompanyInfo({ size: e.target.value })}
          >
            {sizes.map((size) => (
              <MenuItem key={size} value={size}>{size}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Organization type"
            fullWidth
            required
            margin="normal"
            value={type}
            onChange={(e) => setCompanyInfo({ type: e.target.value })}
          >
            {types.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="Location"
            required
            fullWidth
            margin="normal"
            value={location}
            onChange={(e) => setCompanyInfo({ location: e.target.value.slice(0, 50) })}  // Limit to 50 chars
            inputProps={{ maxLength: 50 }}
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

          <Box
            sx={{ border: '1px dashed #ccc', p: 3, textAlign: 'center', my: 2, cursor: 'pointer' }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}  // Use the new handler
              style={{ display: 'none' }}
              id="logo-upload"
            />
            <label htmlFor="logo-upload">
              <Button variant="outlined" component="span">Choose Profile Image</Button>
            </label>
            <Typography variant="body2" mt={1}>Profile image preview</Typography>
          </Box>

          <Box
            sx={{ border: '1px dashed #ccc', p: 3, textAlign: 'center', my: 2, cursor: 'pointer' }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
              id="cover-upload"
            />
            <label htmlFor="cover-upload">
              <Button variant="outlined" component="span">Choose Cover Image</Button>
            </label>
            <Typography variant="body2" mt={1}>Cover image preview</Typography>
          </Box>

          <TextField
            label="Tagline"
            fullWidth
            multiline
            maxRows={4}
            value={tagline}
            onChange={(e) => setCompanyInfo({ tagline: e.target.value })}
            inputProps={{ maxLength: 120 }}
            helperText="Use your tagline to briefly describe what your organization does."
          />

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
