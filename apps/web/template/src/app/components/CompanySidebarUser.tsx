'use client';

import { useState, useRef } from 'react';
import {
  Box, Button, Divider, Typography, List, ListItem,
  Avatar, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CreateDialog from './CreateDialog';
import { useCompanyStore } from '@/app/stores/useCreateCompanyStore';
import { useNavigationStore } from '@/app/stores/useNavigationStore'; // ✅ Import navigation store

export default function CompanySidebarUser() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    name, url, profileImage, coverImage, setCompanyInfo,
  } = useCompanyStore();

  const { activePage, setActivePage } = useNavigationStore(); // ✅ Zustand nav store

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyInfo({ coverImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Box sx={{ width: 350, backgroundColor: 'white', p: 2, ml: 25, borderRadius: 2, mb: 2, mt: 2 }}>
        <Box
          sx={{
            position: 'relative',
            height: 100,
            borderRadius: 2,
            overflow: 'hidden',
            mb: 3,
            backgroundImage: `url(${coverImage || 'https://via.placeholder.com/325x100?text=Cover'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
        </Box>

        <Box sx={{ position: 'relative', mt: -7, mb: 2, zIndex: 3 }}>
          <Avatar
            src={profileImage || undefined}
            sx={{ width: 64, height: 64, border: '2px solid white', backgroundColor: '#ddd' }}
          />
        </Box>

        <Typography fontWeight="600" fontSize={25}>{name || 'Company Name'}</Typography>
        <Typography variant="body2" color="text.secondary">0 followers</Typography>

        <Button variant="contained" size="small" sx={{ mt: 1 }}>
          + Follow
        </Button>
        <Divider sx={{ my: 2 }} />

        <List>
          {['Feed', 'Analytics'].map((item) => (
            <ListItem key={item} sx={{ py: 1 }}>
              <Button
                fullWidth
                variant={activePage === item ? 'contained' : 'text'}
                onClick={() => {
                  setActivePage(item);
                }}
                sx={{
                  textAlign: 'left',
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  fontWeight: '500',
                  fontSize: '1.2rem',
                  backgroundColor: activePage === item ? '#e0e0e0' : 'transparent',
                  color: 'black',
                  '&:hover': {
                    backgroundColor: activePage === item ? '#d5d5d5' : '#f5f5f5',
                  },
                }}
              >
                {item}
              </Button>
            </ListItem>
          ))}
        </List>

        <CreateDialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} />
      </Box>
    </>
  );
}
