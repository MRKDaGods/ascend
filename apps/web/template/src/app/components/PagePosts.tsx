import {
  Avatar, Box, Button, Divider, Grid, Paper, Tab, Tabs, TextField, Typography,
  Modal, IconButton, Menu, MenuItem
} from '@mui/material';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import ImageIcon from '@mui/icons-material/Image';
import ArticleIcon from '@mui/icons-material/Article';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useEffect, useState } from 'react';
import { useCompanyPostStore, MediaFile, CompanyPost } from '@/app/stores/useCompanyPostStore';
import { useCompanyStore } from '@/app/stores/useCreateCompanyStore';

export default function PagePosts() {
  const [tabIndex, setTabIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  const companyId = useCompanyStore((state) => state.companyId);
  const announcements = useCompanyStore((state) => state.announcements || []);
  const getCompanyAnnouncements = useCompanyStore((state) => state.getCompanyAnnouncements);
  const { setCompanyAnnouncementsToPosts } = useCompanyPostStore();

  useEffect(() => {
    if (companyId) {
      getCompanyAnnouncements(companyId).then(() => {
        useCompanyPostStore.getState().setCompanyAnnouncementsToPosts();
      });
    }
  }, [companyId]);

  const {
    createAnnouncementPost,
    updatePost,
    setEditingPost,
    addDraftMedia,
    removeDraftMedia,
    draftPost,
    posts,
    deletePost,
    setDraftPostContent,
    clearDraftPost,
    removedImageIds
  } = useCompanyPostStore();

  const companyName = useCompanyStore((state) => state.name);
  const companyProfileImage = useCompanyStore((state) => state.profileImage);
  const [selectedReactions, setSelectedReactions] = useState<{ [postId: string]: string | null }>({});

  const handleFileUpload = (type: 'image' | 'video') => (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files) return;

  const fileArray: File[] = Array.from(files);
  const mediaArray: MediaFile[] = [];

  fileArray.forEach((file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      useCompanyPostStore.getState().addDraftMedia([
        {
          type,
          file,
          preview: base64, // ✅ MUST be base64 for uploading
        },
      ]);
    };
    reader.readAsDataURL(file); // ✅ This ensures base64, not blob
  });
  
};


  const handleSubmit = async () => {
    const { draftPost, editingPost } = useCompanyPostStore.getState();

    if (isEditing && editingPostId && editingPost) {
      const hasContentChanged = draftPost.content.trim() !== editingPost.content.trim();

      const draftPreviews = draftPost.media.map((m) => m.preview);
      const originalPreviews = editingPost.media.map((m) => m.preview);
      const hasMediaChanged = JSON.stringify(draftPreviews) !== JSON.stringify(originalPreviews);

      if (!hasContentChanged && !hasMediaChanged && removedImageIds.length === 0) {
        console.log("⚠️ No changes detected. Skipping update.");
        setOpen(false);
        setIsEditing(false);
        setEditingPostId(null);
        return;
      }

      const success = await updatePost(editingPostId);
      if (!success) return;
      setIsEditing(false);
      setEditingPostId(null);
    } else {
      const success = await createAnnouncementPost();
      if (!success) return;
    }

    setText('');
    clearDraftPost();
    setOpen(false);
  };

  const handleEditPost = (post: CompanyPost) => {
    clearDraftPost();
    setEditingPost(post);
    setIsEditing(true);
    setEditingPostId(post.id);
    setOpen(true);
    setAnchorEl(null);
    setSelectedPostId(null);
  };

  const handleDeletePost = async (postId: string) => {
    await deletePost(postId);
    setAnchorEl(null);
    setSelectedPostId(null);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="h5" fontWeight={600} mb={0.5}>Page posts</Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>Manage your Page’s organic and paid content</Typography>

          <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tab label="Published" />
          </Tabs>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar src={companyProfileImage || undefined} />
            <TextField
              placeholder="Start a post"
              fullWidth
              size="small"
              onClick={() => {
                setOpen(true);
                setIsEditing(false);
                clearDraftPost();
              }}
              sx={{
                backgroundColor: '#f3f2ef',
                borderRadius: 5,
                '& .MuiInputBase-root': { borderRadius: 5 }
              }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" justifyContent="space-around">
            <Button component="label" startIcon={<ImageIcon color="success" />} sx={{ textTransform: 'none' }}>
              Photo
              <input type="file" accept="image/*" hidden multiple onChange={handleFileUpload('image')} />
            </Button>
            <Button component="label" startIcon={<OndemandVideoIcon color="primary" />} sx={{ textTransform: 'none' }}>
              Video
              <input type="file" accept="video/*" hidden multiple onChange={handleFileUpload('video')} />
            </Button>
          </Box>
        </Paper>

        {posts.map((post) => (
          <Paper key={post.id} sx={{ mt: 3, p: 2, borderRadius: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap={1}>
                {companyProfileImage && <Avatar src={companyProfileImage} sx={{ width: 28, height: 28 }} />}
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold' }}>{companyName}</Typography>
              </Box>
              <IconButton
                onClick={(e) => {
                  setSelectedPostId((prev) => (prev === post.id ? null : post.id));
                  setAnchorEl(e.currentTarget);
                }}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={selectedPostId === post.id}
                onClose={() => setSelectedPostId(null)}
              >
                <MenuItem onClick={() => handleEditPost(post)}>Edit</MenuItem>
                <MenuItem onClick={() => handleDeletePost(post.id)} sx={{ color: 'error.main' }}>Delete</MenuItem>
              </Menu>
            </Box>

            <Typography variant="body1" mt={2} mb={2}>{post.content}</Typography>

            <Grid container spacing={1}>
              {post.media.map((media, index) => (
                <Grid item xs={12} key={index}>
                  {media.type === 'image' && (media.url || media.preview) && (
                    <Box
                      component="img"
                      src={media.url || media.preview}
                      alt="image"
                      sx={{
                        width: '100%',
                        maxHeight: 400,
                        objectFit: 'cover',
                        borderRadius: 2,
                        my: 1,
                      }}
                    />
                  )}
                  {media.type === 'video' && (media.url || media.preview) && (
                    <Box
                      component="video"
                      controls
                      src={media.url || media.preview}
                      sx={{
                        width: '100%',
                        maxHeight: 500,
                        borderRadius: 2,
                        my: 1,
                      }}
                    />
                  )}
                </Grid>
              ))}
            </Grid>

            <Box display="flex" alignItems="center" gap={1} mt={1}>
              {['🧠', '🌿', '❤️'].map((emoji) => {
                const selected = selectedReactions[post.id] === emoji;
                return (
                  <Button
                    key={emoji}
                    size="small"
                    variant={selected ? 'contained' : 'text'}
                    onClick={() => setSelectedReactions((prev) => ({
                      ...prev,
                      [post.id]: prev[post.id] === emoji ? null : emoji
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
              <Typography variant="caption" color="text.secondary" ml={2}>comments · reposts</Typography>
            </Box>
          </Paper>
        ))}

        {posts.length === 0 && (
          <Paper elevation={0} sx={{ textAlign: 'center', py: 5, px: 2, mt: 4 }}>
            <img src="/NoPostsyet.png" alt="No posts" width={200} style={{ marginBottom: 16 }} />
            <Typography variant="h6" fontWeight={600}>Your Page doesn’t have any posts yet</Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Pages that post 2x a week grow 5x faster
            </Typography>
            <Button variant="outlined" sx={{ mt: 2 }} onClick={() => setOpen(true)}>Start a post</Button>
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

      <Modal open={open} onClose={() => setOpen(false)}>
        <Paper sx={{ width: 500, mx: 'auto', mt: 10, p: 3, borderRadius: 2, outline: 'none' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={600}>{isEditing ? 'Edit post' : 'Create a post'}</Typography>
            <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
          </Box>

          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder="What do you want to talk about?"
            value={draftPost.content}
            onChange={(e) => {
              const value = e.target.value;
              setText(value);
              setDraftPostContent(value);
            }}
            sx={{ mb: 2 }}
          />

          <Box display="flex" justifyContent="space-around" mb={2}>
            <Button component="label" startIcon={<ImageIcon color="success" />} sx={{ textTransform: 'none' }}>
              Photo
              <input type="file" accept="image/*" hidden multiple onChange={handleFileUpload('image')} />
            </Button>
            <Button component="label" startIcon={<OndemandVideoIcon color="primary" />} sx={{ textTransform: 'none' }}>
              Video
              <input type="file" accept="video/*" hidden multiple onChange={handleFileUpload('video')} />
            </Button>
          </Box>

          <Box display="flex" flexDirection="column" gap={2} mb={2}>
            {draftPost.media.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center">
                No media attached.
              </Typography>
            ) : (
              draftPost.media.map((media: MediaFile, i: number) => (
                <Box key={i} display="flex" alignItems="center" gap={2}>
                  {media.type === 'image' && (
                    <Box
                      component="img"
                      src={media.url || media.preview}
                      alt="preview"
                      sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                    />
                  )}
                  {media.type === 'video' && (
                    <Box
                      component="video"
                      src={media.url || media.preview}
                      controls
                      sx={{ width: 120, height: 80, borderRadius: 1 }}
                    />
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      flex: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {media.file?.name ??
                      decodeURIComponent(media.url?.split('/view?')[1]?.split('&')[0] || 'media')}
                  </Typography>
                  <Button size="small" color="error" onClick={() => removeDraftMedia(i)}>
                    Remove
                  </Button>
                </Box>
              ))
            )}
          </Box>



          <Button fullWidth variant="contained" onClick={handleSubmit}>
            {isEditing ? 'Save Changes' : 'Post'}
          </Button>
        </Paper>
      </Modal>
    </Grid>
  );
}
