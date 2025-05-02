'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/api/api';
import { 
  Card, 
  Box, 
  Typography, 
  Chip, 
  Avatar, 
  IconButton, 
  Stack, 
  Button, 
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Grid,
  Divider,
  Paper,
  TextField,
  MenuItem,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import CategoryIcon from '@mui/icons-material/Category';
import LanguageIcon from '@mui/icons-material/Language';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { useJobStore, JobStatus, ApplicationStatus } from '../stores/useJobStore';
import { styled } from '@mui/material/styles';

// Define rounded style constants for reuse throughout the component
const roundedButtonStyle = {
  borderRadius: '20px',
  textTransform: 'none',
  fontWeight: 500
};

const roundedTextFieldStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '20px',
  }
};

const roundedSelectStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '20px',
  }
};

const roundedDialogStyle = {
  borderRadius: '16px'
};

// Add these options for dropdowns
const jobTypeOptions = ["Full-time", "Part-time", "Contract", "Temporary", "Volunteer", "Internship", "Other"];
const experienceLevelOptions = ["Internship", "Entry", "Associate", "Mid", "Director"];
const workplaceTypeOptions = ["On-site", "Remote", "Hybrid"];
const industryOptions = ["Technology", "Finance", "Healthcare", "Education", "Retail", "Creative", "Other"];

// Define JobCardProps interface
interface JobCardProps {
  job_id: number;
  title: string;
  description: string;
  industry: string;
  type: string;
  experience_level: string;
  location: string;
  workplace_type: string;
  salary_min_range: number | null;
  salary_max_range: number | null;
  company_id?: number;
  company_name: string;
  company_logo_url: string | null;
  saved_at: Date;
  applicationStatus?: ApplicationStatus;
  status?: JobStatus;
  onDelete: (job_id: number) => void;
  created_at?: Date;
  company_description?: string;
  company_industry?: string;
  company_location?: string;
}

const JobCard: React.FC<JobCardProps> = ({
  job_id,
  title,
  description,
  industry,
  type,
  experience_level,
  location,
  workplace_type,
  salary_min_range,
  salary_max_range,
  company_name,
  company_logo_url,
  saved_at,
  applicationStatus,
  status,
  onDelete,
  created_at,
  company_description,
  company_industry,
  company_location,
}) => {
  const router = useRouter();
  const { deletePostedJob } = useJobStore();
  
  // Add states for UI feedback and modals
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  
  // Add states for editing job details
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Define job status variables
  const isPostedJob = status === 'Posted';
  const isAppliedJob = status === 'Applied';
  const isSavedJob = status === 'Saved';
  
  // Move displayValues state to the component level
  const [displayValues, setDisplayValues] = useState({
    title: title,
    description: description,
    industry: industry,
    type: type,
    experience_level: experience_level,
    location: location,
    workplace_type: workplace_type,
    salary_min_range: salary_min_range,
    salary_max_range: salary_max_range
  });
  
  const [editedJob, setEditedJob] = useState({
    title: title,
    description: description,
    industry: industry,
    type: type,
    experience_level: experience_level,
    location: location,
    workplace_type: workplace_type,
    salary_min_range: salary_min_range !== null ? salary_min_range : '',
    salary_max_range: salary_max_range !== null ? salary_max_range : '',
  });
  
  // Define the toggleEditMode function
  const toggleEditMode = () => {
    if (isEditMode) {
      // Reset form if canceling edit
      setEditedJob({
        title: displayValues.title,
        description: displayValues.description,
        industry: displayValues.industry,
        type: displayValues.type,
        experience_level: displayValues.experience_level,
        location: displayValues.location,
        workplace_type: displayValues.workplace_type,
        salary_min_range: displayValues.salary_min_range !== null ? displayValues.salary_min_range : '',
        salary_max_range: displayValues.salary_max_range !== null ? displayValues.salary_max_range : '',
      });
    }
    setIsEditMode(!isEditMode);
  };
  
  // Add the missing handleEditChange function
  const handleEditChange = (field: string, value: any) => {
    setEditedJob(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Format date without date-fns
  const formatDate = (date: Date | undefined): string => {
    if (!date) return '';
    
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    
    return d.toLocaleDateString('en-US', options);
  };
  
  const displayDate = created_at 
    ? formatDate(created_at)
    : saved_at 
      ? formatDate(saved_at)
      : null;
      
  // Save changes using PATCH endpoint
  const saveChanges = async () => {
    setIsSaving(true);
    
    try {
      // Create an object to track only changed fields
      const changedFields: Record<string, any> = {};
      
      // Compare each field with the original values
      if (editedJob.title !== title) changedFields.title = editedJob.title;
      if (editedJob.description !== description) changedFields.description = editedJob.description;
      if (editedJob.industry !== industry) changedFields.industry = editedJob.industry;
      if (editedJob.type !== type) changedFields.type = editedJob.type;
      if (editedJob.experience_level !== experience_level) changedFields.experience_level = editedJob.experience_level;
      if (editedJob.location !== location) changedFields.location = editedJob.location;
      if (editedJob.workplace_type !== workplace_type) changedFields.workplace_type = editedJob.workplace_type;
      
      // For salary fields, handle the conversion from empty string to null
      const currentMinSalary = salary_min_range !== null ? salary_min_range : '';
      const currentMaxSalary = salary_max_range !== null ? salary_max_range : '';
      
      if (String(editedJob.salary_min_range) !== String(currentMinSalary)) {
        changedFields.salary_min_range = editedJob.salary_min_range ? Number(editedJob.salary_min_range) : null;
      }
      
      if (String(editedJob.salary_max_range) !== String(currentMaxSalary)) {
        changedFields.salary_max_range = editedJob.salary_max_range ? Number(editedJob.salary_max_range) : null;
      }
      
      // If no fields have changed, show a message and return
      if (Object.keys(changedFields).length === 0) {
        setSuccessMessage('No changes to save');
        setShowSuccess(true);
        setIsEditMode(false);
        setIsSaving(false);
        return;
      }

      // Changed from API.get to API.patch
      const response = await API.patch(`/job/${job_id}`, changedFields);
      
      if (!response.data) {
        throw new Error(`Failed to update job: ${response.status}`);
      }
      
      // Parse the response to get the updated job data
      const updatedJobData = response.data;
      
      // Update the display values with the response
      setDisplayValues({
        title: updatedJobData.title || title,
        description: updatedJobData.description || description,
        industry: updatedJobData.industry || industry,
        type: updatedJobData.type || type,
        experience_level: updatedJobData.experience_level || experience_level,
        location: updatedJobData.location || location,
        workplace_type: updatedJobData.workplace_type || workplace_type,
        salary_min_range: updatedJobData.salary_min_range ?? salary_min_range,
        salary_max_range: updatedJobData.salary_max_range ?? salary_max_range
      });
      
      // Show success message
      setSuccessMessage('Job details updated successfully!');
      setShowSuccess(true);
      
      // Exit edit mode
      setIsEditMode(false);
      
    } catch (error) {
      console.error('Error updating job:', error);
      setSuccessMessage('Failed to update job. Please try again.');
      setShowSuccess(true);
    } finally {
      setIsSaving(false);
    }
  };

  // Modified to open details modal for posted jobs
  const handleClick = () => {
    if (isPostedJob) {
      setDetailsModalOpen(true);
    } else {
      // For saved or applied jobs, use the existing behavior
      const queryParams = new URLSearchParams({
        id: job_id.toString(),
        title,
        company: company_name,
        location,
        type,
        description: '',
        about: '',
        requirements: '',
      });
      router.push(`/jobs/apply?${queryParams.toString()}`);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/jobs/JobPosting/edit/${job_id}`);
  };

  const getApplicationStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'Pending':
        return 'default';
      case 'Viewed':
        return 'info';
      case 'Rejected':
        return 'error';
      case 'Accepted':
        return 'success';
      default:
        return 'default';
    }
  };

  // Function to handle job deletion
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isPostedJob) {
      // Open the confirmation dialog for posted jobs
      setDeleteDialogOpen(true);
    } else {
      // For saved or applied jobs, use the regular onDelete function
      onDelete(job_id);
    }
  };
  
  // Updated function to handle dialog confirmation
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const success = await deletePostedJob(job_id);
      
      if (success) {
        setSuccessMessage(`Job "${title}" was successfully deleted!`);
        setShowSuccess(true);
      }
      
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting job:', error);
      setSuccessMessage('Failed to delete job. Please try again.');
      setShowSuccess(true);
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Handle closing the success message
  const handleCloseSnackbar = () => {
    setShowSuccess(false);
  };

  // Format salary display
  const formatSalary = () => {
    if (displayValues.salary_min_range && displayValues.salary_max_range) {
      return `$${displayValues.salary_min_range.toLocaleString()} - $${displayValues.salary_max_range.toLocaleString()}`;
    } else if (displayValues.salary_min_range) {
      return `From $${displayValues.salary_min_range.toLocaleString()}`;
    } else if (displayValues.salary_max_range) {
      return `Up to $${displayValues.salary_max_range.toLocaleString()}`;
    }
    return 'Not specified';
  };

  return (
    <>
      {/* Card component stays the same */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 4,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          p: 3,
          transition: '0.25s ease-in-out',
          '&:hover': {
            boxShadow: '0 6px 24px rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)',
          },
          cursor: 'pointer',
          border: isPostedJob ? '1px solid #4caf50' : 'none',
        }}
        onClick={handleClick}
      >
        {/* Card content stays the same */}
        <Box display="flex" alignItems="center" gap={3}>
          <Avatar
            src={company_logo_url || ''}
            alt={company_name}
            variant="rounded"
            sx={{ width: 64, height: 64 }}
          >
            {!company_logo_url && <BusinessCenterIcon sx={{ fontSize: 32 }} />}
          </Avatar>

          <Box flexGrow={1}>
            <Typography variant="h6" fontWeight={600} color="#0a66c2">
              {displayValues.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {company_name} • {isPostedJob ? company_location || displayValues.location : displayValues.location}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {displayValues.type}
            </Typography>
            {isPostedJob && company_industry && (
              <Typography variant="body2" color="text.secondary">
                Industry: {displayValues.industry}
              </Typography>
            )}
          </Box>

          <Stack spacing={1} alignItems="flex-end">
            {/* Status chips stay the same */}
            {status && (
              <Tooltip title={`Status: ${status}`}>
                <Chip
                  label={status}
                  color={
                    status === 'Saved'
                      ? 'default'
                      : status === 'Applied'
                      ? 'warning'
                      : status === 'Posted'
                      ? 'success'
                      : 'default'
                  }
                  variant="outlined"
                  sx={{
                    fontWeight: 600,
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    px: 2,
                  }}
                />
              </Tooltip>
            )}
            {applicationStatus && (
              <Chip
                label={applicationStatus}
                color={getApplicationStatusColor(applicationStatus)}
                variant="outlined"
                sx={{
                  fontWeight: 600,
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  px: 2,
                }}
              />
            )}
          </Stack>
        </Box>

        {/* Other card content stays the same */}
        {isPostedJob && (
          <Box mt={2} display="flex" gap={2}>
            <Button 
              variant="outlined" 
              color="primary" 
              size="small"
              sx={{ 
                ...roundedButtonStyle,
                px: 2,
              }}
              onClick={(e) => {
                e.stopPropagation();
                // Pass the title and company as query parameters
                router.push(`/jobs/job/${job_id}`);
              }}
              data-testid="job-card-view-applications"
            >
              View Applications
            </Button>
            <Button 
              variant="outlined" 
              color="info" 
              size="small"
              startIcon={<EditIcon fontSize="small" />}
              sx={{ 
                ...roundedButtonStyle,
                px: 2,
              }}
              onClick={(e) => {
                e.stopPropagation();
                // Open the details modal with edit mode enabled
                setDetailsModalOpen(true);
                setIsEditMode(true);
              }}
              data-testid="job-card-edit-button"
            >
              Edit
            </Button>
          </Box>
        )}

        {displayDate && (
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Typography variant="caption" color="text.secondary">
              {isPostedJob ? `Posted on ${displayDate}` : `Saved on ${displayDate}`}
            </Typography>
          </Box>
        )}

        <Box display="flex" justifyContent="flex-end" mt={1}>
          <IconButton 
            onClick={handleDelete}
            size="small"
            data-testid="job-card-delete-button"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Card>
      
      {/* Updated Job Details Modal with edit functionality */}
      <Dialog 
        open={detailsModalOpen} 
        onClose={() => {
          if (!isEditMode) {
            setDetailsModalOpen(false);
          }
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { 
            ...roundedDialogStyle,
            p: { xs: 0.5, sm: 1 },
            width: { xs: '95%', sm: '90%', md: '80%' },
            margin: 'auto'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, // Stack vertically on mobile
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            pb: { xs: 1, sm: 2 }
          }}
        >
          <Box 
            display="flex" 
            alignItems="center" 
            gap={2}
            width={{ xs: '100%', sm: 'auto' }}
          >
            <Avatar
              src={company_logo_url || ''}
              alt={company_name}
              sx={{ width: { xs: 50, sm: 60 }, height: { xs: 50, sm: 60 } }}
            >
              {!company_logo_url && <BusinessCenterIcon sx={{ fontSize: { xs: 30, sm: 36 } }} />}
            </Avatar>
            <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
              {isEditMode ? (
                <TextField 
                  fullWidth
                  value={editedJob.title}
                  onChange={(e) => handleEditChange('title', e.target.value)}
                  label="Job Title"
                  variant="outlined"
                  size="small"
                  sx={{ 
                    mb: 1, 
                    minWidth: { xs: '100%', sm: '300px' },
                    ...roundedTextFieldStyle
                  }}
                  data-testid="job-card-edit-title"
                />
              ) : (
                <Typography variant="h5" fontWeight="bold" sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>
                  {displayValues.title}
                </Typography>
              )}
              <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                {company_name}
              </Typography>
            </Box>
          </Box>
          
          <Box 
            display="flex" 
            alignItems="center"
            mt={{ xs: 1, sm: 0 }}
            width={{ xs: '100%', sm: 'auto' }}
            justifyContent={{ xs: 'space-between', sm: 'flex-end' }}
          >
            {isPostedJob && (
              <Button 
                variant={isEditMode ? "contained" : "outlined"}
                color={isEditMode ? "success" : "primary"}
                startIcon={isEditMode ? <SaveIcon /> : <EditIcon />}
                onClick={isEditMode ? saveChanges : toggleEditMode}
                disabled={isSaving}
                sx={{
                  ...roundedButtonStyle,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  py: { xs: 0.5, sm: 1 },
                  whiteSpace: 'nowrap'
                }}
                data-testid="job-card-save-changes"
              >
                {isSaving ? (
                  <>
                    <CircularProgress size={16} sx={{ mr: 1 }} /> Saving...
                  </>
                ) : isEditMode ? (
                  "Save Changes"
                ) : (
                  "Edit Details"
                )}
              </Button>
            )}
            
            {isEditMode && (
              <IconButton 
                onClick={toggleEditMode}
                sx={{ ml: 1 }}
                color="default"
              >
                <CloseIcon />
              </IconButton>
            )}
          </Box>
        </DialogTitle>
        
        <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {/* Job details section */}
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom fontWeight={600} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Job Description
              </Typography>
              
              {isEditMode ? (
                <TextField
                  label="Job Description"
                  multiline
                  rows={4}
                  fullWidth
                  value={editedJob.description}
                  onChange={(e) => handleEditChange('description', e.target.value)}
                  margin="normal"
                  sx={roundedTextFieldStyle}
                  data-testid="job-card-edit-description"
                />
              ) : (
                <Typography variant="body1" sx={{ 
                  whiteSpace: 'pre-line', 
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}>
                  {displayValues.description || "No description provided."}
                </Typography>
              )}
              
              {/* Salary information */}
              <Typography variant="h6" gutterBottom fontWeight={600} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Salary
              </Typography>
              
              {isEditMode ? (
                <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mb: { xs: 2, sm: 3 } }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Minimum Salary"
                      variant="outlined"
                      size="small"
                      value={editedJob.salary_min_range}
                      onChange={(e) => handleEditChange('salary_min_range', e.target.value)}
                      InputProps={{ inputProps: { min: 0 } }}
                      sx={roundedTextFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Maximum Salary"
                      variant="outlined"
                      size="small"
                      value={editedJob.salary_max_range}
                      onChange={(e) => handleEditChange('salary_max_range', e.target.value)}
                      InputProps={{ inputProps: { min: 0 } }}
                      sx={roundedTextFieldStyle}
                    />
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="body1" sx={{ 
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}>
                  {formatSalary()}
                </Typography>
              )}
            </Grid>
            
            {/* Job meta info section */}
            <Grid item xs={12} md={4}>
              <Paper elevation={1} sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom fontWeight={600} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  Job Details
                </Typography>
                
                <Stack spacing={isEditMode ? { xs: 2, sm: 3 } : { xs: 1.5, sm: 2 }}>
                  {isEditMode ? (
                    <>
                      <TextField
                        label="Location"
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={editedJob.location}
                        onChange={(e) => handleEditChange('location', e.target.value)}
                        sx={roundedTextFieldStyle}
                      />
                      
                      <TextField
                        select
                        label="Job Type"
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={editedJob.type}
                        onChange={(e) => handleEditChange('type', e.target.value)}
                        sx={roundedSelectStyle}
                      >
                        {jobTypeOptions.map(option => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </TextField>
                      
                      <TextField
                        select
                        label="Experience Level"
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={editedJob.experience_level}
                        onChange={(e) => handleEditChange('experience_level', e.target.value)}
                        sx={roundedSelectStyle}
                      >
                        {experienceLevelOptions.map(option => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </TextField>
                      
                      <TextField
                        select
                        label="Industry"
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={editedJob.industry}
                        onChange={(e) => handleEditChange('industry', e.target.value)}
                        sx={roundedSelectStyle}
                      >
                        {industryOptions.map(option => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </TextField>
                      
                      <TextField
                        select
                        label="Workplace Type"
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={editedJob.workplace_type}
                        onChange={(e) => handleEditChange('workplace_type', e.target.value)}
                        sx={roundedSelectStyle}
                      >
                        {workplaceTypeOptions.map(option => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </TextField>
                    </>
                  ) : (
                    <>
                      <Box display="flex" gap={1.5} alignItems="center">
                        <LocationOnIcon color="action" sx={{ fontSize: { xs: 18, sm: 24 } }} />
                        <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          <strong>Location:</strong> {displayValues.location}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" gap={1.5} alignItems="center">
                        <WorkIcon color="action" sx={{ fontSize: { xs: 18, sm: 24 } }} />
                        <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          <strong>Job Type:</strong> {displayValues.type}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" gap={1.5} alignItems="center">
                        <SchoolIcon color="action" sx={{ fontSize: { xs: 18, sm: 24 } }} />
                        <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          <strong>Experience:</strong> {displayValues.experience_level}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" gap={1.5} alignItems="center">
                        <CategoryIcon color="action" sx={{ fontSize: { xs: 18, sm: 24 } }} />
                        <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          <strong>Industry:</strong> {displayValues.industry}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" gap={1.5} alignItems="center">
                        <LanguageIcon color="action" sx={{ fontSize: { xs: 18, sm: 24 } }} />
                        <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          <strong>Workplace:</strong> {displayValues.workplace_type}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Stack>
              </Paper>
              
              {created_at && !isEditMode && (
                <Typography variant="caption" color="text.secondary" display="block" textAlign="right">
                  Posted on {formatDate(created_at)}
                </Typography>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: { xs: 1.5, sm: 2 }, 
          flexDirection: { xs: 'column', sm: 'row' }, 
          alignItems: 'stretch'
        }}>
          {!isEditMode && (
            <Button 
              onClick={() => router.push(`/job/${job_id}/applications?title=${encodeURIComponent(title)}&company=${encodeURIComponent(company_name)}`)} 
              variant="contained" 
              color="primary"
              fullWidth={window.innerWidth < 600} // Responsive full-width button on mobile
              sx={{ 
                mb: { xs: 1, sm: 0 },
                ...roundedButtonStyle
              }}
            >
              View Applications
            </Button>
          )}
          <Button 
            onClick={() => {
              if (isEditMode) {
                toggleEditMode();
              } else {
                setDetailsModalOpen(false);
              }
            }} 
            variant="outlined"
            fullWidth={window.innerWidth < 600} // Responsive full-width button on mobile
            sx={roundedButtonStyle}
          >
            {isEditMode ? "Cancel" : "Close"}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog stays the same */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !isDeleting && setDeleteDialogOpen(false)}
        aria-labelledby="delete-job-dialog-title"
        aria-describedby="delete-job-dialog-description"
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          sx: {
            ...roundedDialogStyle,
            p: 1
          }
        }}
      >
        <DialogTitle id="delete-job-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningAmberIcon color="warning" />
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-job-dialog-description">
            Are you sure you want to delete the job posting: <strong>"{title}"</strong>?
            <br />
            This action cannot be undone and all applications for this job will be deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            variant="outlined"
            color="inherit"
            disabled={isDeleting}
            sx={roundedButtonStyle}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            variant="contained" 
            color="error"
            disabled={isDeleting}
            autoFocus
            sx={roundedButtonStyle}
          >
            {isDeleting ? 'Deleting...' : 'Delete Job'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Notification stays the same */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          variant="filled"
          sx={{ 
            width: '100%', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontWeight: 500
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default JobCard;
