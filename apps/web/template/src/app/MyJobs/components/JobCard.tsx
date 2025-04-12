import { Box, Typography, Avatar, IconButton } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

type JobCardProps = {
  title: string;
  company: string;
  location: string;
  logo: string;
  reviewTime: string;
};

const JobCard = ({ title, company, location, logo, reviewTime }: JobCardProps) => {
  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        borderRadius: 2,
        boxShadow: '0px 0px 4px rgba(0,0,0,0.15)',
        p: 2,
        mb: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        maxWidth: 600,
        mx: 'auto', // center the card
      }}
    >
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Avatar src={logo} alt={company} sx={{ width: 48, height: 48 }} />
        <Box>
          <Typography fontWeight={600} color="black">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {company}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {location}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <CheckCircleIcon color="success" fontSize="small" />
            <Typography variant="body2" color="green" ml={0.5}>
              Actively recruiting
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Posted {reviewTime}
          </Typography>
        </Box>
      </Box>

      <IconButton>
        <MoreHorizIcon />
      </IconButton>
    </Box>
  );
};

export default JobCard;
 