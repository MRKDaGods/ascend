// CompanySidebarUser.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Box, Button, Divider, Typography, List, ListItem,
  Avatar, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CreateDialog from './CreateDialog';
import { useCompanyStore } from '@/app/stores/useCreateCompanyStore';
import { useNavigationStore } from '@/app/stores/useNavigationStore';
import Cookies from "js-cookie";

export default function CompanySidebarUser() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    name,
    profileImage,
    coverImage,
    setCompanyInfo,
    followerCounts,
    followingStatus,
    toggleFollowCompany,
    fetchCompanyFollowers,
  } = useCompanyStore();

  const userId = Cookies.get("linkup_user_id");
  const companyId = Number(localStorage.getItem("companyId"));

  useEffect(() => {
    if (companyId && userId) {
      fetchCompanyFollowers(companyId, Number(userId));
    }
  }, [companyId, userId]);

  const { activePage, setActivePage } = useNavigationStore();

  return (
    <>
      <Box id="company-sidebar-user" sx={{ width: 350, backgroundColor: 'white', p: 2, ml: 25, borderRadius: 2, mb: 2, mt: 2 }}>
        <Box
          id="company-sidebar-user-cover"
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
        ></Box>

        <Box id="company-sidebar-user-avatar" sx={{ position: 'relative', mt: -7, mb: 2, zIndex: 3 }}>
          <Avatar
            id="company-avatar"
            src={profileImage || undefined}
            sx={{ width: 64, height: 64, border: '2px solid white', backgroundColor: '#ddd' }}
          />
        </Box>

        <Typography id="company-name" fontWeight="600" fontSize={25}>{name || 'Company Name'}</Typography>
        <Typography id="company-followers" variant="body2" color="text.secondary">
          {followerCounts[companyId] ?? 0} followers
        </Typography>

        <Button
          id="follow-button"
          variant="contained"
          size="small"
          onClick={() => toggleFollowCompany(companyId, Number(userId))}
          sx={{ mt: 1 }}
        >
          {followingStatus[companyId] ? "Unfollow" : "Follow"}
        </Button>

        <Divider id="sidebar-divider" sx={{ my: 2 }} />

        <List id="sidebar-navigation">
          {['Feed', 'Company jobs'].map((item) => (
            <ListItem key={item} id={`sidebar-item-${item.toLowerCase()}`} sx={{ py: 1 }}>
              <Button
                id={`sidebar-button-${item.toLowerCase()}`}
                fullWidth
                variant={activePage === item ? 'contained' : 'text'}
                onClick={() => setActivePage(item)}
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
