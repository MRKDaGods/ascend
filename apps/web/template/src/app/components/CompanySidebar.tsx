'use client';

import { useState, useRef } from 'react';
import {
  Box, Button, Divider, Typography, List, ListItem,
  Avatar, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CreateDialog from './CreateDialog';
import EditPageModal from './EditPageModal';
import CompanyJobsList from './CompanyJobsList';
import { useRouter } from "next/navigation";
import CompanySettings from './CompanySettings';
import { useCompanyStore } from '@/app/stores/useCreateCompanyStore';
import { useNavigationStore } from '@/app/stores/useNavigationStore'; // ✅ Import navigation store



export default function Sidebar() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { companyId } = useCompanyStore();


  const {
    name, profileImage, coverImage, setCompanyInfo,
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
      <Box id="company-sidebar" sx={{ width: 350, backgroundColor: 'white', p: 2, ml: 25, borderRadius: 2, mb: 2, mt: 2 }}>
        <Box
          id="company-sidebar-cover"
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
          <IconButton
            id="edit-cover-button"
            size="small"
            onClick={() => fileInputRef.current?.click()}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'white',
              '&:hover': { backgroundColor: '#eee' },
              zIndex: 2,
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <input
            id="cover-image-input"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleCoverImageChange}
          />
        </Box>

        <Box id="company-sidebar-avatar" sx={{ position: 'relative', mt: -7, mb: 2, zIndex: 3 }}>
          <Avatar
            id="company-avatar"
            src={profileImage || undefined}
            sx={{ width: 64, height: 64, border: '2px solid white', backgroundColor: '#ddd' }}
          />
        </Box>

        <Typography id="company-name" fontWeight="600" fontSize={25}>{name || 'Company Name'}</Typography>
        <Typography id="company-followers" variant="body2" color="text.secondary">0 followers</Typography>

        <Button
          id="create-button"
          variant="contained"
          size="small"
          sx={{ mt: 1 }}
          onClick={() => setOpenCreateDialog(true)}
        >
          + Create
        </Button>

        <Button id="view-as-member-button" variant="outlined" size="small" sx={{ mt: 1 }}>
          View as member
        </Button>

        <Divider id="sidebar-divider" sx={{ my: 2 }} />

        <List id="sidebar-navigation">
          {['Dashboard', 'Page posts', 'Analytics', 'Feed', 'Edit page', 'Jobs', 'Deactivate Page'].map((item) => (
            <ListItem key={item} id={`sidebar-item-${item.toLowerCase().replace(/\s+/g, '-')}`} sx={{ py: 1 }}>
              <Button
                id={`sidebar-button-${item.toLowerCase().replace(/\s+/g, '-')}`}
                fullWidth
                variant={activePage === item ? 'contained' : 'text'}
                onClick={() => {
                  setActivePage(item);
                  if (item === 'Edit page') setShowEditModal(true)
                    else if (item === 'Jobs') {
                       router.push("/jobs/PostJob")}
                       
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

      <EditPageModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={() => setShowEditModal(false)} 
      />
      
    </>
  );
}
