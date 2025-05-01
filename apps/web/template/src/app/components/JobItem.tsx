import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, CardActions, Button, Avatar, Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
import PersonIcon from '@mui/icons-material/Person';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

const JobItem = ({ 
  job_id, 
  title, 
  company, 
  location, 
  type, 
  description, 
  experienceLevel, 
  salaryRange,
  company_logo_url,
  industry,
  workplace_type,
  experience_level,
  salary_min_range,
  salary_max_range,
  about,
  requirements,
  company_name
}: any) => {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const displayCompany = company || company_name || 'Company';
  
  const handleApplyClick = () => {
    const queryParams = new URLSearchParams({
      id: job_id.toString(),
      title,
      company: displayCompany,
      location,
      type,
      description,
      industry: industry || '',
      experience_level: experience_level || experienceLevel || '',
      workplace_type: workplace_type || '',
      ...(salary_min_range && { salary_min_range: salary_min_range.toString() }),
      ...(salary_max_range && { salary_max_range: salary_max_range.toString() })
    });
    
    // Include about and requirements if available
    if (about) {
      queryParams.append('about', about);
    }
    
    if (requirements && Array.isArray(requirements)) {
      queryParams.append('requirements', requirements.join(','));
    }
    
    router.push(`/apply?${queryParams.toString()}`);
  };

  return (
    <Card 
      elevation={3} 
      sx={{ 
        borderRadius: 2, 
        overflow: 'hidden', 
        mb: 2,
        height: '300px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            {company_logo_url && !imgError ? (
              <Avatar
                src={company_logo_url}
                alt={displayCompany}
                sx={{ width: 50, height: 50, cursor: "pointer" }}
                onError={() => setImgError(true)}
              />
            ) : (
              <Avatar
                sx={{ 
                  width: 56, 
                  height: 56,
                  bgcolor: company_logo_url ? 'transparent' : 'primary.main',
                }}
                data-testid="PersonIcon"
              >
                {displayCompany.charAt(0).toUpperCase()}
              </Avatar>
            )}
          </Grid>
          <Grid item xs>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {displayCompany} - {location}
            </Typography>
          </Grid>
        </Grid>
        <Box mt={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Type:</strong> {type}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Experience Level:</strong> {experienceLevel || experience_level}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Salary:</strong> {salaryRange || (salary_min_range && salary_max_range ? 
              `$${salary_min_range.toLocaleString()} - $${salary_max_range.toLocaleString()}` : 
              'Not specified')}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            mt={1}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              lineHeight: '1.4em',
              maxHeight: '4.2em',
            }}
          >
            {description}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleApplyClick}
          data-testid="job-item-apply-button"
          sx={{ borderRadius: '20px' }}
        >
          Apply Now
        </Button>
      </CardActions>
    </Card>
  );
};

export default JobItem;
