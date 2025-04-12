'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
} from '@mui/material';

type Props = {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setLogo: (file: File | null) => void;
};

const sizes = ['1-10', '11-50', '51-200', '201-500', '500+'];
const types = ['Public', 'Private', 'Non-profit'];

const CompanyForm = ({ formData, setFormData, setLogo }: Props) => {
  const [isChecked, setIsChecked] = useState(false); // Track checkbox state

  // Function to check if all required fields are filled and the checkbox is checked
  const isFormValid = () => {
    return (
      formData.name !== '' &&
      formData.url !== '' &&
      formData.industry !== '' &&
      formData.size !== '' &&
      formData.type !== '' &&
      formData.tagline !== '' && // Optional: check if tagline is filled too
      isChecked // Ensure the checkbox is checked
    );
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
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="linkedin.com/company/"
            required
            fullWidth
            margin="normal"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          />
          <Typography sx={{ mb: 2, mt: 1 }} color="primary">
            Learn more about the Page Public URL
          </Typography>

          <TextField
            label="Website"
            fullWidth
            margin="normal"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />

          <TextField
            label="Industry"
            required
            fullWidth
            margin="normal"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
          />

          <TextField
            select
            label="Organization size"
            fullWidth
            required
            margin="normal"
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
          >
            {sizes.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Organization type"
            fullWidth
            required
            margin="normal"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            {types.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <Box
            sx={{
              border: '1px dashed #ccc',
              p: 3,
              textAlign: 'center',
              my: 2,
              cursor: 'pointer',
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
              id="logo-upload"
            />
            <label htmlFor="logo-upload">
              <Button variant="outlined" component="span">
                Choose file
              </Button>
            </label>
            <Typography variant="body2" mt={1}>
              Upload to see preview
            </Typography>
            <Typography variant="caption" color="text.secondary">
              300x300px recommended. JPGs, JPEGs, and PNGs supported.
            </Typography>
          </Box>

          <TextField
            label="Tagline"
            fullWidth
            multiline
            maxRows={4}
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            inputProps={{ maxLength: 120 }}
            helperText="Use your tagline to briefly describe what your organization does."
          />

          {/* Checkbox to verify the authorization */}
          <FormControlLabel
            control={<Checkbox checked={isChecked} onChange={() => setIsChecked(!isChecked)} />}
            label="I verify that I am an authorized representative of this organization and agree to the additional terms."
            sx={{ mt: 2 }}
          />

          {/* Button is enabled only when the form is valid and checkbox is checked */}
          <Button
            variant="contained"
            disabled={!isFormValid()} // Disable button if form is not valid or checkbox is not checked
            sx={{ mt: 2 }}
          >
            Create Page
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CompanyForm;
