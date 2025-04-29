'use client';
import React from 'react';
import {
  Box,
  Card,
  Typography,
  Chip,
  Avatar,
  CardContent,
  Grid,
  Button,
  ButtonGroup,
  Link,
  Divider,
  Stack,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';

interface ApplicationProps {
  application: {
    application_id: number;
    status: 'Pending' | 'Viewed' | 'Rejected' | 'Accepted';
    resume_url: string | null;
    created_at: string;
    email: string;
    phone: string;
    name?: string;
    profile_photo_url?: string;
  };
  onUpdateStatus: (applicationId: number, status: 'Pending' | 'Viewed' | 'Rejected' | 'Accepted') => void;
}

const ApplicationCard: React.FC<ApplicationProps> = ({ application, onUpdateStatus }) => {
  const formattedDate = new Date(application.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'default';
      case 'Viewed': return 'info';
      case 'Rejected': return 'error';
      case 'Accepted': return 'success';
      default: return 'default';
    }
  };

  const displayName = application.name || application.email.split('@')[0];

  return (
    <Card 
      elevation={2} 
      sx={{ 
        borderRadius: 3,
        overflow: 'hidden',
        transition: '0.2s',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        },
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={2}>
          {/* Left section: Applicant info */}
          <Grid item xs={12} md={8}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Avatar 
                src={application.profile_photo_url || ''} 
                alt={displayName}
                sx={{ 
                  width: 60, 
                  height: 60,
                  bgcolor: !application.profile_photo_url ? 'primary.main' : undefined,
                }}
              >
                {!application.profile_photo_url && <PersonIcon fontSize="large" />}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {displayName}
                </Typography>
                <Chip 
                  label={application.status} 
                  size="small"
                  color={getStatusColor(application.status)}
                  sx={{ fontWeight: 500, mt: 0.5 }}
                />
              </Box>
            </Box>

            <Stack spacing={1.5} sx={{ ml: 0.5 }}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <EmailIcon fontSize="small" color="action" />
                <Typography variant="body2">{application.email}</Typography>
              </Box>
              
              {application.phone && (
                <Box display="flex" alignItems="center" gap={1.5}>
                  <LocalPhoneIcon fontSize="small" color="action" />
                  <Typography variant="body2">{application.phone}</Typography>
                </Box>
              )}
              
              <Box display="flex" alignItems="center" gap={1.5}>
                <CalendarTodayIcon fontSize="small" color="action" />
                <Typography variant="body2">Applied on {formattedDate}</Typography>
              </Box>
              
              {application.resume_url && (
                <Box display="flex" alignItems="center" gap={1.5}>
                  <DescriptionIcon fontSize="small" color="action" />
                  <Link 
                    href={application.resume_url} 
                    target="_blank"
                    underline="hover"
                    rel="noopener noreferrer"
                  >
                    View Resume
                  </Link>
                </Box>
              )}
            </Stack>
          </Grid>
          
          {/* Right section: Actions */}
          <Grid item xs={12} md={4}>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'center',
                borderLeft: { xs: 0, md: '1px solid' },
                borderTop: { xs: '1px solid', md: 0 },
                borderColor: 'divider',
                pt: { xs: 2, md: 0 },
                mt: { xs: 2, md: 0 },
                pl: { xs: 0, md: 2 },
              }}
            >
              <Typography variant="subtitle2" gutterBottom color="text.secondary">
                Update Status:
              </Typography>
              <ButtonGroup orientation="vertical" variant="outlined" fullWidth>
                <Button
                  variant="outlined"
                  disabled={application.status === 'Viewed'}
                  onClick={() => onUpdateStatus(application.application_id, 'Viewed')}
                  data-testid="application-view-button"
                >
                  Mark as Viewed
                </Button>

                <Button
                  variant="outlined"
                  color="success"
                  disabled={application.status === 'Accepted'}
                  onClick={() => onUpdateStatus(application.application_id, 'Accepted')}
                  data-testid="application-accept-button"
                >
                  Accept
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  disabled={application.status === 'Rejected'}
                  onClick={() => onUpdateStatus(application.application_id, 'Rejected')}
                  data-testid="application-reject-button"
                >
                  Reject
                </Button>
              </ButtonGroup>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;