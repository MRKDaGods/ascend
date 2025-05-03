// components/DashboardActions.tsx
import { Box, Typography, Paper, Link, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function DashboardActions() {
  const actions = [
    {
      title: 'Add website URL',
      description: 'Add a URL to drive more Page visitors to your website.',
    },
    {
      title: 'Add description',
      description: 'Add a quick description to get your Page discovered in search results.',
    },
  ];

  return (
    <Box id="dashboard-actions" sx={{ backgroundColor: 'white', padding: 2, borderRadius: 2, mb: 0, width: '90%' }}>
      <Typography id="dashboard-actions-title" variant="h6" fontWeight="600">Today’s actions</Typography>
      <Typography id="dashboard-actions-subtitle" variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Pages that complete these actions regularly grow 4x faster
      </Typography>

      {actions.map((action, idx) => (
        <Paper
          id={`dashboard-action-${idx}`}
          key={idx}
          sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}
        >
          <Box id={`dashboard-action-content-${idx}`}>
            <Typography id={`dashboard-action-title-${idx}`} fontWeight="600">{action.title}</Typography>
            <Typography id={`dashboard-action-description-${idx}`} variant="body2">
              {action.description} <Link id={`dashboard-action-link-${idx}`} href="#">Add</Link>
            </Typography>
          </Box>
          <IconButton id={`dashboard-action-close-${idx}`}>
            <CloseIcon />
          </IconButton>
        </Paper>
      ))}
    </Box>
  );
}
