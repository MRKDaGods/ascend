"use client";
import {
    Dialog,
    DialogContent,
    Stack,
    Button,
    IconButton,
    Box,
    Typography,
  } from '@mui/material';
  import CloseIcon from '@mui/icons-material/Close';
  import PostAddIcon from '@mui/icons-material/PostAdd';
  import EventIcon from '@mui/icons-material/Event';
  import WorkIcon from '@mui/icons-material/Work';
  import ArticleIcon from '@mui/icons-material/Article';
  import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
  import CampaignIcon from '@mui/icons-material/Campaign';
  import BuildIcon from '@mui/icons-material/Build';
  import PagesIcon from '@mui/icons-material/Pages';
  
  interface CreateDialogProps {
    open: boolean;
    onClose: () => void;
  }
  
  const createOptions = [
    {
      title: "Start a post",
      subtitle: "Share content to connect with you followers",
      icon: <PostAddIcon />,
    },
    {
      title: "Create an event",
      subtitle: "Host an event to grow your Page's community",
      icon: <EventIcon />,
    },
    {
      title: "Post a free job",
      subtitle: "Reach more qualified applicants",
      icon: <WorkIcon />,
    },
    {
      title: "Publish an article",
      subtitle: "Connect with your followers through long-form content",
      icon: <ArticleIcon />,
    },
    {
      title: "Add a product",
      subtitle: "Spotlight your organization's products",
      icon: <ShoppingCartIcon />,
    },
    {
      title: "Create an ad",
      subtitle: "Generate leads, drive website traffic, and build brand awareness",
      icon: <CampaignIcon />,
    },
    {
      title: "Add services",
      subtitle: "Share what services you offer",
      icon: <BuildIcon />,
    },
    {
      title: "Create a showcase page",
      subtitle: "Add more details about your organization",
      icon: <PagesIcon />,
    },
  ];
  
  export default function CreateDialog({ open, onClose }: CreateDialogProps) {
    const handleOptionClick = (option: string) => {
      alert(`You clicked: ${option}`);
      onClose();
    };
  
    return (
      <Dialog
        onClose={onClose}
        open={open}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { maxHeight: '80vh' } }}
      >
        {/* Title Bar with Close Button */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: '600' }}>
            Create
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
  
        <DialogContent dividers>
          <Stack spacing={1} sx={{ overflowY: 'auto' }}>
            {createOptions.map(({ title, subtitle, icon }) => (
              <Button
                key={title}
                onClick={() => handleOptionClick(title)}
                sx={{
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  height: '4rem',
                  paddingY: 2,
                  paddingX: 1,
                  borderRadius: 1,
                  color: 'black',
                  alignItems: 'flex-start',
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                }}
                fullWidth
                disableElevation
                variant="text"
                startIcon={icon}
              >
                <Box textAlign="left">
                  <Typography fontWeight="500">{title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {subtitle}
                  </Typography>
                </Box>
              </Button>
            ))}
          </Stack>
        </DialogContent>
      </Dialog>
    );
  }
  