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
    <Grid container spacing={3} id="page-posts-user-company-container">
      <Grid item xs={12} md={8} id="page-posts-user-company-main">
        <Paper id="page-posts-header" variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Typography id="page-posts-title" variant="h5" fontWeight={600} mb={0.5}>
            Page posts
          </Typography>
          <Tabs
            id="page-posts-tabs"
            value={tabIndex}
            onChange={(_, newValue) => setTabIndex(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
          >
            <Tab id="page-posts-tab-published" label="Published" />
          </Tabs>
        </Paper>

        {announcements.map((announcement) => (
          <Paper id={`announcement-${announcement.announcement_id}`} key={announcement.announcement_id} sx={{ mt: 3, p: 2, borderRadius: 3 }}>
            <Box id={`announcement-header-${announcement.announcement_id}`} display="flex" justifyContent="space-between" alignItems="center">
              <Box id={`announcement-header-info-${announcement.announcement_id}`} display="flex" alignItems="center" gap={1}>
                {companyProfileImage && (
                  <Avatar
                    id={`announcement-avatar-${announcement.announcement_id}`}
                    src={companyProfileImage}
                    sx={{ width: 28, height: 28 }}
                  />
                )}
                <Typography
                  id={`announcement-company-name-${announcement.announcement_id}`}
                  variant="subtitle2"
                  fontWeight="bold"
                  color="text.secondary"
                >
                  {companyName}
                </Typography>
              </Box>
              <IconButton
                id={`announcement-menu-button-${announcement.announcement_id}`}
                onClick={(e) => {
                  setSelectedPostId((prev) =>
                    prev === announcement.announcement_id.toString() ? null : announcement.announcement_id.toString()
                  );
                  setAnchorEl(e.currentTarget);
                }}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id={`announcement-menu-${announcement.announcement_id}`}
                anchorEl={anchorEl}
                open={selectedPostId === announcement.announcement_id.toString()}
                onClose={() => setSelectedPostId(null)}
              >
                <MenuItem id={`announcement-report-button-${announcement.announcement_id}`} onClick={() => setSelectedPostId(null)}>
                  Report
                </MenuItem>
              </Menu>
            </Box>

            <Typography id={`announcement-content-${announcement.announcement_id}`} variant="body1" mt={2} mb={2}>
              {announcement.content}
            </Typography>

            <Grid id={`announcement-media-${announcement.announcement_id}`} container spacing={1}>
              {announcement.image_urls?.map((url: string, index: number) => (
                <Grid item xs={12} key={index}>
                  <Box
                    id={`announcement-image-${announcement.announcement_id}-${index}`}
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
                    id={`announcement-video-${announcement.announcement_id}`}
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

            <Box id={`announcement-reactions-${announcement.announcement_id}`} display="flex" alignItems="center" gap={1} mt={1}>
              {['🧠', '🌿', '❤️'].map((emoji) => {
                const selected = selectedReactions[announcement.announcement_id] === emoji;
                return (
                  <Button
                    id={`announcement-reaction-${announcement.announcement_id}-${emoji}`}
                    key={emoji}
                    size="small"
                    variant={selected ? 'contained' : 'text'}
                    onClick={() =>
                      setSelectedReactions((prev) => ({
                        ...prev,
                        [announcement.announcement_id]: prev[announcement.announcement_id] === emoji ? null : emoji,
                      }))                    }
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
          <Paper id="no-announcements-section" elevation={0} sx={{ textAlign: 'center', py: 5, px: 2, mt: 4 }}>
            <img id="no-announcements-image" src="/NoPostsyet.png" alt="No posts" width={200} style={{ marginBottom: 16 }} />
            <Typography id="no-announcements-title" variant="h6" fontWeight={600}>
              Page doesn’t have any posts yet
            </Typography>
            <Typography id="no-announcements-subtitle" variant="body2" color="text.secondary" mt={1}>
              Pages that post 2x a week grow 5x faster
            </Typography>
          </Paper>
        )}
      </Grid>

      <Grid item xs={12} md={4} id="post-highlights-section">
        <Paper id="post-highlights-container" variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Typography id="post-highlights-title" variant="subtitle1" fontWeight={600}>
            Post highlights
          </Typography>
          <Typography id="post-highlights-subtitle" variant="body2" color="text.secondary" mb={2}>
            In the last 30 days
          </Typography>
          <Box id="post-highlights-content" textAlign="center">
            <img id="post-highlights-image" src="/highlights.png" alt="No highlights" width={200} style={{ marginBottom: 16 }} />
            <Typography id="post-highlights-no-highlights" fontWeight={600}>
              No highlights
            </Typography>
            <Typography id="post-highlights-description" variant="body2" color="text.secondary">
              No recent post to highlight.
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
