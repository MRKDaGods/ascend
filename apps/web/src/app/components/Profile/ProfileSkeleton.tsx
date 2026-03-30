import { Box, Paper, Skeleton } from "@mui/material";

export const ProfileSkeleton = () => {
    return (
      <Box>
        <Skeleton variant="rectangular" height={200} />
        <Box sx={{ p: 3, display: 'flex' }}>
          <Skeleton variant="circular" width={150} height={150} sx={{ mt: -7 }} />
          <Box sx={{ ml: 3, width: '100%' }}>
            <Skeleton variant="text" height={50} width="40%" />
            <Skeleton variant="text" height={30} width="30%" />
            <Skeleton variant="text" height={25} width="20%" />
          </Box>
        </Box>
  
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
          <Skeleton variant="text" height={40} width="20%" />
          <Skeleton variant="text" height={100} />
        </Paper>
  
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
          <Skeleton variant="text" height={40} width="20%" />
          <Box sx={{ mt: 2 }}>
            {[1, 2].map((i) => (
              <Box key={i} sx={{ display: 'flex', mb: 2 }}>
                <Skeleton variant="circular" width={50} height={50} sx={{ mr: 2 }} />
                <Box sx={{ width: '100%' }}>
                  <Skeleton variant="text" height={30} width="40%" />
                  <Skeleton variant="text" height={25} width="30%" />
                  <Skeleton variant="text" height={20} width="20%" />
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
  
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
          <Skeleton variant="text" height={40} width="20%" />
          <Box sx={{ mt: 2 }}>
            {[1, 2].map((i) => (
              <Box key={i} sx={{ display: 'flex', mb: 2 }}>
                <Skeleton variant="circular" width={50} height={50} sx={{ mr: 2 }} />
                <Box sx={{ width: '100%' }}>
                  <Skeleton variant="text" height={30} width="40%" />
                  <Skeleton variant="text" height={25} width="30%" />
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    );
  };