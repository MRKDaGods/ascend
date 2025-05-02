'use client';

import {
  Avatar, Box, Button, Grid, IconButton, Menu, MenuItem, Paper, Tab, Tabs, Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useEffect, useState } from 'react';
import { getCompanyAnnouncementsAPI } from '@/api/company';
import { useCompanyStore } from '@/app/stores/useCreateCompanyStore';

export default function PagePostsUserCompany() {
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedReactions, setSelectedReactions] = useState<{ [postId: number]: string | null }>({});
  const [announcements, setAnnouncements] = useState<any[]>([]);

  const companyId = useCompanyStore((state) => state.companyId);
  const companyName = useCompanyStore((state) => state.name);
  const companyProfileImage = useCompanyStore((state) => state.profileImage);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (companyId) {
        const fetched = await getCompanyAnnouncementsAPI(companyId);
        setAnnouncements(fetched);
      }
    };
    fetchAnnouncements();
  }, [companyId]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="h5" fontWeight={600} mb={0.5}>Page posts</Typography>
          <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tab label="Published" />
          </Tabs>
        </Paper>

        {announcements.map((announcement) => (
          <Paper key={announcement.announcement_id} sx={{ mt: 3, p: 2, borderRadius: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap={1}>
                {companyProfileImage && <Avatar src={companyProfileImage} sx={{ width: 28, height: 28 }} />}
                <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">{companyName}</Typography>
              </Box>
              <IconButton
                onClick={(e) => {
                  setSelectedPostId((prev) => (prev === announcement.announcement_id.toString() ? null : announcement.announcement_id.toString()));
                  setAnchorEl(e.currentTarget);
                }}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={selectedPostId === announcement.announcement_id.toString()}
                onClose={() => setSelectedPostId(null)}
              >
                <MenuItem onClick={() => setSelectedPostId(null)}>Report</MenuItem>
              </Menu>
            </Box>

            <Typography variant="body1" mt={2} mb={2}>{announcement.content}</Typography>

            <Grid container spacing={1}>
              {announcement.image_urls?.map((url: string, index: number) => (
                <Grid item xs={12} key={index}>
                  <Box
                    component="img"
                    src={url}
                    alt="Announcement Image"
                    sx={{
                      width: '100%',
                      maxHeight: 400,
                      objectFit: 'cover',
                      borderRadius: 2,
                      my: 1,
                    }}
                  />
                </Grid>
              ))}
              {announcement.video_url && (
                <Grid item xs={12}>
                  <Box
                    component="video"
                    controls
                    src={announcement.video_url}
                    sx={{
                      width: '100%',
                      maxHeight: 500,
                      borderRadius: 2,
                      my: 1,
                    }}
                  />
                </Grid>
              )}
            </Grid>

            <Box display="flex" alignItems="center" gap={1} mt={1}>
              {['🧠', '🌿', '❤️'].map((emoji) => {
                const selected = selectedReactions[announcement.announcement_id] === emoji;
                return (
                  <Button
                    key={emoji}
                    size="small"
                    variant={selected ? 'contained' : 'text'}
                    onClick={() => setSelectedReactions((prev) => ({
                      ...prev,
                      [announcement.announcement_id]: prev[announcement.announcement_id] === emoji ? null : emoji,
                    }))}
                    sx={{
                      minWidth: '32px',
                      px: 1,
                      backgroundColor: selected ? '#e0f7fa' : 'transparent',
                      color: selected ? 'primary.main' : 'text.primary',
                    }}
                  >
                    {emoji}
                  </Button>
                );
              })}
            </Box>
          </Paper>
        ))}

        {announcements.length === 0 && (
          <Paper elevation={0} sx={{ textAlign: 'center', py: 5, px: 2, mt: 4 }}>
            <img src="/NoPostsyet.png" alt="No posts" width={200} style={{ marginBottom: 16 }} />
            <Typography variant="h6" fontWeight={600}>Page doesn’t have any posts yet</Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Pages that post 2x a week grow 5x faster
            </Typography>
          </Paper>
        )}
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>Post highlights</Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>In the last 30 days</Typography>
          <Box textAlign="center">
            <img src="/highlights.png" alt="No highlights" width={200} style={{ marginBottom: 16 }} />
            <Typography fontWeight={600}>No highlights</Typography>
            <Typography variant="body2" color="text.secondary">No recent post to highlight.</Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
