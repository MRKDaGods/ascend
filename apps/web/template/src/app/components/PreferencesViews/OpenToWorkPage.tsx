"use client";
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  IconButton,
  TextField,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { usePreferencesModal } from '../../store/usePreferencesModal';

const MAX_JOB_TITLES = 5;

const jobLocationTypes = ['On-site', 'Hybrid', 'Remote'] as const;

type JobLocationType = typeof jobLocationTypes[number];

interface OpenToWorkModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const OpenToWorkModal: React.FC<OpenToWorkModalProps> = ({ open, onClose, onSave }) => {
  const { closeModal, setView } = usePreferencesModal(); // Access closeModal and setView from the store
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const [jobTitleInput, setJobTitleInput] = useState('');
  const [locationTypes, setLocationTypes] = useState<JobLocationType[]>([]);
  const [onSiteLocations, setOnSiteLocations] = useState('');

  const handleAddJobTitle = () => {
    if (jobTitleInput && jobTitles.length < MAX_JOB_TITLES) {
      setJobTitles([...jobTitles, jobTitleInput]);
      setJobTitleInput('');
    }
  };

  const handleDeleteJobTitle = (titleToDelete: string) => {
    setJobTitles((titles) => titles.filter((title) => title !== titleToDelete));
  };

  const handleLocationTypeChange = (
    _: React.MouseEvent<HTMLElement>,
    newLocationTypes: JobLocationType[]
  ) => {
    setLocationTypes(newLocationTypes);
  };

  const handleSave = () => {
    const data = {
      jobTitles,
      locationTypes,
      onSiteLocations,
    };
    onSave(data);
    onClose();
  };

  const handleBack = () => {
    setView('main'); // Set the view back to 'main'
    closeModal(); // Close the current modal
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Edit job preferences
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle2" gutterBottom>
          Job titles*
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
          {jobTitles.map((title, index) => (
            <Chip
              key={index}
              label={title}
              onDelete={() => handleDeleteJobTitle(title)}
              color="success"
            />
          ))}
        </Box>
        <Box display="flex" gap={1} alignItems="center" mb={2}>
          <TextField
            size="small"
            label="Add title"
            value={jobTitleInput}
            onChange={(e) => setJobTitleInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddJobTitle()}
            disabled={jobTitles.length >= MAX_JOB_TITLES}
          />
          <Button onClick={handleAddJobTitle} disabled={jobTitles.length >= MAX_JOB_TITLES}>
            + Add title
          </Button>
        </Box>
        {jobTitles.length >= MAX_JOB_TITLES && (
          <Typography variant="caption" color="text.secondary">
            You’ve reached the maximum
          </Typography>
        )}

        <Typography variant="subtitle2" mt={3} mb={1}>
          Location types*
        </Typography>
        <ToggleButtonGroup
          value={locationTypes}
          onChange={handleLocationTypeChange}
          aria-label="location types"
          fullWidth
        >
          {jobLocationTypes.map((type) => (
            <ToggleButton key={type} value={type}>
              {type}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Typography variant="subtitle2" mt={3} mb={1}>
          Locations (on-site)*
        </Typography>
        <TextField
          fullWidth
          placeholder="City, Country"
          value={onSiteLocations}
          onChange={(e) => setOnSiteLocations(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={closeModal}>Back</Button> 
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OpenToWorkModal;