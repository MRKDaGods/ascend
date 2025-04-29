'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { useJobStore } from '@/app/shared/store/useJobStore';

// Add these options for dropdowns
const jobTypeOptions = ["Full-time", "Part-time", "Contract", "Temporary", "Volunteer", "Internship", "Other"];
const experienceLevelOptions = ["Internship", "Entry", "Associate", "Mid", "Director"];
const workplaceTypeOptions = ["On-site", "Remote", "Hybrid"];
const industryOptions = ["Technology", "Finance", "Healthcare", "Education", "Retail", "Creative", "Other"];

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
      const changedFields = {};
      
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
      
      const response = await fetch(`https://api.ascendx.tech/job/${job_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTc0NTkzNjc1OSwiZXhwIjoxNzQ1OTc5OTU5fQ.WIm_tsdNxFna8iSU82Q6Q0wykRHN8W93rwwuixbtbZ8',
        },
        body: JSON.stringify(changedFields),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update job: ${response.status}`);
      }
      
      // Parse the response to get the updated job data
      const updatedJobData = await response.json();
      
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
      
      // Update the edited job values to match the new display values
      setEditedJob({
        title: updatedJobData.title || title,
        description: updatedJobData.description || description,
        industry: updatedJobData.industry || industry,
        type: updatedJobData.type || type,
        experience_level: updatedJobData.experience_level || experience_level,
        location: updatedJobData.location || location,
        workplace_type: updatedJobData.workplace_type || workplace_type,
        salary_min_range: (updatedJobData.salary_min_range !== null) ? updatedJobData.salary_min_range : '',
        salary_max_range: (updatedJobData.salary_max_range !== null) ? updatedJobData.salary_max_range : ''
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
      router.push(`/apply?${queryParams.toString()}`);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/JobPosting/edit/${job_id}`);
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
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {company_name} • {isPostedJob ? company_location || location : location}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {type}
            </Typography>
            {isPostedJob && company_industry && (
              <Typography variant="body2" color="text.secondary">
                Industry: {company_industry}
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
                borderRadius: 20, 
                px: 2,
                textTransform: 'none',
                fontWeight: 500
              }}
              onClick={(e) => {
                e.stopPropagation();
                // Pass the title and company as query parameters
                router.push(`/job/${job_id}/applications?title=${encodeURIComponent(title)}&company=${encodeURIComponent(company_name)}&location=${encodeURIComponent(location || '')}`);
              }}
            >
              View Applications
            </Button>
            <Button 
              variant="outlined" 
              color="info" 
              size="small"
              startIcon={<EditIcon fontSize="small" />}
              sx={{ 
                borderRadius: 20,
                px: 2,
                textTransform: 'none',
                fontWeight: 500
              }}
              onClick={(e) => {
                e.stopPropagation();
                // Open the details modal with edit mode enabled
                setDetailsModalOpen(true);
                setIsEditMode(true);
              }}
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
            color="error"
            size="small"
            sx={{ 
              '&:hover': { 
                bgcolor: 'rgba(211, 47, 47, 0.04)' 
              } 
            }}
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
            borderRadius: 3,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={company_logo_url || ''}
              alt={company_name}
              sx={{ width: 60, height: 60 }}
            >
              {!company_logo_url && <BusinessCenterIcon sx={{ fontSize: 36 }} />}
            </Avatar>
            <Box>
              {isEditMode ? (
                <TextField 
                  fullWidth
                  value={editedJob.title}
                  onChange={(e) => handleEditChange('title', e.target.value)}
                  label="Job Title"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 1, minWidth: '300px' }}
                />
              ) : (
                <Typography variant="h5" fontWeight="bold">
                  {displayValues.title}
                </Typography>
              )}
              <Typography variant="subtitle1" color="text.secondary">
                {company_name}
              </Typography>
            </Box>
          </Box>
          
          {isPostedJob && (
            <Button 
              variant={isEditMode ? "contained" : "outlined"}
              color={isEditMode ? "success" : "primary"}
              startIcon={isEditMode ? <SaveIcon /> : <EditIcon />}
              onClick={isEditMode ? saveChanges : toggleEditMode}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} /> Saving...
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
        </DialogTitle>
        
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Job details section */}
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Job Description
              </Typography>
              
              {isEditMode ? (
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  value={editedJob.description}
                  onChange={(e) => handleEditChange('description', e.target.value)}
                  label="Job Description"
                  variant="outlined"
                  sx={{ mb: 3 }}
                />
              ) : (
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 3 }}>
                  {displayValues.description || "No description provided."}
                </Typography>
              )}
              
              {/* Salary information */}
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Salary
              </Typography>
              
              {isEditMode ? (
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Minimum Salary"
                      variant="outlined"
                      value={editedJob.salary_min_range}
                      onChange={(e) => handleEditChange('salary_min_range', e.target.value)}
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Maximum Salary"
                      variant="outlined"
                      value={editedJob.salary_max_range}
                      onChange={(e) => handleEditChange('salary_max_range', e.target.value)}
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {formatSalary()}
                </Typography>
              )}
            </Grid>
            
            {/* Job meta info section */}
            <Grid item xs={12} md={4}>
              <Paper elevation={1} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Job Details
                </Typography>
                
                <Stack spacing={isEditMode ? 3 : 2}>
                  {isEditMode ? (
                    <>
                      <TextField
                        fullWidth
                        label="Location"
                        variant="outlined"
                        size="small"
                        value={editedJob.location}
                        onChange={(e) => handleEditChange('location', e.target.value)}
                      />
                      
                      <TextField
                        select
                        fullWidth
                        label="Job Type"
                        variant="outlined"
                        size="small"
                        value={editedJob.type}
                        onChange={(e) => handleEditChange('type', e.target.value)}
                      >
                        {jobTypeOptions.map(option => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </TextField>
                      
                      <TextField
                        select
                        fullWidth
                        label="Experience Level"
                        variant="outlined"
                        size="small"
                        value={editedJob.experience_level}
                        onChange={(e) => handleEditChange('experience_level', e.target.value)}
                      >
                        {experienceLevelOptions.map(option => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </TextField>
                      
                      <TextField
                        select
                        fullWidth
                        label="Industry"
                        variant="outlined"
                        size="small"
                        value={editedJob.industry}
                        onChange={(e) => handleEditChange('industry', e.target.value)}
                      >
                        {industryOptions.map(option => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </TextField>
                      
                      <TextField
                        select
                        fullWidth
                        label="Workplace Type"
                        variant="outlined"
                        size="small"
                        value={editedJob.workplace_type}
                        onChange={(e) => handleEditChange('workplace_type', e.target.value)}
                      >
                        {workplaceTypeOptions.map(option => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </TextField>
                    </>
                  ) : (
                    <>
                      <Box display="flex" gap={1.5} alignItems="center">
                        <LocationOnIcon color="action" />
                        <Typography variant="body2">
                          <strong>Location:</strong> {displayValues.location}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" gap={1.5} alignItems="center">
                        <WorkIcon color="action" />
                        <Typography variant="body2">
                          <strong>Job Type:</strong> {displayValues.type}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" gap={1.5} alignItems="center">
                        <SchoolIcon color="action" />
                        <Typography variant="body2">
                          <strong>Experience:</strong> {displayValues.experience_level}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" gap={1.5} alignItems="center">
                        <CategoryIcon color="action" />
                        <Typography variant="body2">
                          <strong>Industry:</strong> {displayValues.industry}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" gap={1.5} alignItems="center">
                        <LanguageIcon color="action" />
                        <Typography variant="body2">
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
        
        <DialogActions sx={{ p: 2 }}>
          {!isEditMode && (
            <Button 
              onClick={() => router.push(`/job/${job_id}/applications?title=${encodeURIComponent(title)}&company=${encodeURIComponent(company_name)}`)} 
              variant="contained" 
              color="primary"
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
            borderRadius: 2,
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
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            variant="contained" 
            color="error"
            disabled={isDeleting}
            autoFocus
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
