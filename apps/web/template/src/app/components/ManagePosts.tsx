"use client";

import { Box, Typography, Link, useTheme } from "@mui/material";

export default function ManagePosts() {
  const theme = useTheme(); // ✅ Use MUI theme for dynamic styling

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        p: 2,
        borderRadius: 2,
        mb: 2,
        mt: 0,
        width: "90%",
        boxShadow: theme.shadows[1],
      }}
    >
      <Typography variant="h6" fontWeight="bold">
        Manage recent posts
      </Typography>
      <Typography variant="body2" sx={{ mb: 3 }} color="text.secondary">
        Manage your page’s content and amplify your reach with boosting.{" "}
        <Link
          href="#"
          sx={{ color: theme.palette.primary.main, fontWeight: 500 }}
        >
          Learn more
        </Link>
      </Typography>

      <Box sx={{ textAlign: "center" }}>
        <img
          src="/signuplock.png"
          alt="No posts"
          style={{ maxWidth: 200, marginBottom: 16 }}
        />
        <Typography variant="h6" color="text.primary">
          Your page doesn’t have any posts from the last 90 days
        </Typography>
      </Box>
    </Box>
  );
}
