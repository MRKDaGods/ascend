// components/ManagePosts.tsx
import { Box, Typography, Link } from '@mui/material';

export default function ManagePosts() {
  return (
    <Box sx={{backgroundColor: 'white', padding: 2, borderRadius: 2, mb: 2, mt: 0, width: '90%'}}>
      <Typography variant="h6" fontWeight="bold">Manage recent posts</Typography>
      <Typography variant="body2" sx={{ mb: 3 }}>
        Manage your page’s content and amplify your reach with boosting. <Link href="#">Learn more</Link>
      </Typography>
      <Box sx={{ textAlign: 'center' }}>
        <img
          src="/signuplock.png"
          alt="No posts"
          style={{ maxWidth: 200, marginBottom: 16 }}
        />
        <Typography variant="h6">Your page doesn’t have any posts from the last 90 days</Typography>
      </Box>
    </Box>
  );
}
