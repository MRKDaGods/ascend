'use client';

import {
  Box,
  Dialog,
  DialogContent,
  Typography,
  TextField,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState, useRef } from 'react';
import { useCompanyStore } from '@/app/stores/useCompanyStore';

interface EditPageModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (updated: Partial<ReturnType<typeof useCompanyStore>>) => void;
}

const sections = ['Page info'];

export default function EditPageModal({ open, onClose, onSave }: EditPageModalProps) {
  const {
    name,
    url,
    website,
    industry,
    size,
    type,
    tagline,
    location,
    description,
    profileImage: storeProfileImage,
    coverImage: storeCoverImage,
    setCompanyInfo,
  } = useCompanyStore();

  const [formData, setFormData] = useState({
    name,
    url,
    website,
    industry,
    size,
    type,
    tagline,
    location,
    description,
  });

  const [originalData, setOriginalData] = useState({
    name,
    url,
    website,
    industry,
    size,
    type,
    tagline,
    location,
    description,
  });

  const [isModified, setIsModified] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(storeProfileImage);
  const [coverImage, setCoverImage] = useState<string | null>(storeCoverImage);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const data = {
      name,
      url,
      website,
      industry,
      size,
      type,
      tagline,
      location,
      description,
    };
    setFormData(data);
    setOriginalData(data);
    setProfileImage(storeProfileImage);
    setCoverImage(storeCoverImage);
    setIsModified(false);
  }, [name, url, website, industry, size, type, tagline, location, description, storeProfileImage, storeCoverImage, open]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const newImage = reader.result as string;
        if (type === 'profile') {
          setProfileImage(newImage);
        } else {
          setCoverImage(newImage);
        }
        setIsModified(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const updated = { ...formData, [field]: e.target.value };
    setFormData(updated);
    setIsModified(true);
  };

  const discardChanges = () => {
    setFormData(originalData);
    setProfileImage(storeProfileImage);
    setCoverImage(storeCoverImage);
    setIsModified(false);
  };

  const saveChanges = () => {
    const updatedData = { ...formData, profileImage, coverImage };
    setOriginalData(updatedData);
    setCompanyInfo(updatedData);
    onSave(updatedData);
    setIsModified(false);
  };

  const renderSectionContent = () => {
    if (activeSection === 'Page info') {
      return (
        <>
          {/* Cover Photo */}
          <Box
            sx={{
              height: 200,
              width: '50%',
              backgroundImage: `url(${coverImage || 'https://via.placeholder.com/1200x300?text=Cover+Photo'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 1,
              position: 'relative',
              mb: 2,
            }}
          >
            <IconButton
              onClick={() => coverInputRef.current?.click()}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'white',
                border: '1px solid #ccc',
                '&:hover': { backgroundColor: '#f5f5f5' },
              }}
              size="small"
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <input
              type="file"
              accept="image/*"
              ref={coverInputRef}
              onChange={(e) => handleImageUpload(e, 'cover')}
              style={{ display: 'none' }}
            />
          </Box>

          {/* Profile Avatar */}
          <Box display="flex" alignItems="center" mb={3} position="relative">
            <Avatar
              src={profileImage || undefined}
              sx={{ width: 72, height: 72, mr: 2 }}
            />
            <IconButton
              onClick={() => profileInputRef.current?.click()}
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 50,
                backgroundColor: 'white',
                border: '1px solid #ccc',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
              size="small"
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <input
              type="file"
              accept="image/*"
              ref={profileInputRef}
              onChange={(e) => handleImageUpload(e, 'profile')}
              style={{ display: 'none' }}
            />
          </Box>

          <TextField label="Name *" value={formData.name} onChange={handleChange('name')} fullWidth sx={{ mb: 2 }} />
          <TextField label="URL" value={formData.url} onChange={handleChange('url')} fullWidth sx={{ mb: 2 }} />
          <TextField label="Website" value={formData.website} onChange={handleChange('website')} fullWidth sx={{ mb: 2 }} />
          <TextField label="Industry" value={formData.industry} onChange={handleChange('industry')} fullWidth sx={{ mb: 2 }} />
          <TextField label="Organization Size" value={formData.size} onChange={handleChange('size')} fullWidth sx={{ mb: 2 }} />
          <TextField label="Organization Type" value={formData.type} onChange={handleChange('type')} fullWidth sx={{ mb: 2 }} />
          <TextField label="Tagline" value={formData.tagline} onChange={handleChange('tagline')} fullWidth sx={{ mb: 2 }} />
          <TextField label="Location" value={formData.location} onChange={handleChange('location')} fullWidth sx={{ mb: 2 }} />
          <TextField label="Description" value={formData.description} onChange={handleChange('description')} fullWidth multiline rows={3} sx={{ mb: 2 }} />

          <Divider sx={{ my: 3 }} />

          <Box sx={{ backgroundColor: '#fff9ec', p: 2, borderRadius: 1 }}>
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
              🟨 PREMIUM
            </Typography>
            <Typography fontSize={14}>
              Stand out and build credibility — Showcase client testimonials, convert more clients with a custom call-to-action, and grow your business faster.
            </Typography>
          </Box>
        </>
      );
    }
    return <Typography fontSize={14}>{activeSection} content goes here.</Typography>;
  };

  const [activeSection, setActiveSection] = useState('Page info');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
          borderBottom: '1px solid #ddd',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: '600' }}>
          Edit
        </Typography>
        <Box display="flex" gap={1}>
          {isModified && (
            <>
              <Button size="small" onClick={discardChanges} variant="outlined">
                Discard Changes
              </Button>
              <Button size="small" onClick={saveChanges} variant="contained">
                Save
              </Button>
            </>
          )}
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <DialogContent sx={{ p: 0, display: 'flex', height: '80vh' }}>
        <Box
          sx={{
            width: 200,
            backgroundColor: 'white',
            borderRight: '1px solid #ddd',
            overflowY: 'auto',
            height: '100%',
            p: 2,
          }}
        >
          <List>
            {sections.map((section) => (
              <ListItem
                key={section}
                disablePadding
                onClick={() => setActiveSection(section)}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: activeSection === section ? '#e0f2ff' : 'transparent',
                  borderRadius: 1,
                  mb: 0.5,
                }}
              >
                <ListItemText
                  primary={section}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: activeSection === section ? 'primary.main' : 'text.primary',
                    sx: { pl: 1, py: 0.5 },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="600">{activeSection}</Typography>
          </Box>
          {renderSectionContent()}
        </Box>
      </DialogContent>
    </Dialog>
  );
}