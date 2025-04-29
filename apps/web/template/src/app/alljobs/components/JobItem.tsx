import React from 'react';
import { Box, Typography, Card, CardContent, CardActions, Button, Avatar, Grid } from '@mui/material';
import { useRouter } from 'next/navigation';

const JobItem = ({ job_id, title, company, location, type, description, experienceLevel, salaryRange }: any) => {
  const router = useRouter();

  const handleApplyClick = () => {
    const queryParams = new URLSearchParams({
      id: job_id.toString(),
      title,
      company,
      location,
      type,
      description,
      experienceLevel,
      salaryRange,
    });
    router.push(`/apply?${queryParams.toString()}`);
  };

  return (
    <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', mb: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              {company?.charAt(0).toUpperCase()}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {company} - {location}
            </Typography>
          </Grid>
        </Grid>
        <Box mt={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Type:</strong> {type}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Experience Level:</strong> {experienceLevel}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Salary:</strong> {salaryRange || 'Not specified'}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            {description}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleApplyClick}
          data-testid="job-item-apply-button"
        >
          Apply Now
        </Button>
      </CardActions>
    </Card>
  );
};

export default JobItem;
