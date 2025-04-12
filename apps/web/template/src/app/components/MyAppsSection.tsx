import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import SellIcon from '@mui/icons-material/Explore';
import GroupIcon from '@mui/icons-material/Groups';
import InsightsIcon from '@mui/icons-material/Insights';
import PostAddIcon from '@mui/icons-material/PostAdd';
import StoreIcon from '@mui/icons-material/Store';
import AdsClickIcon from '@mui/icons-material/AdsClick';

const items = [
  { category: 'My Apps', label: 'Sell', icon: <SellIcon /> },
  { label: 'Groups', icon: <GroupIcon /> },
  { category: 'Talent', label: 'Talent Insights', icon: <InsightsIcon /> },
  { label: 'Post a job', icon: <PostAddIcon /> },
  { category: 'Sales', label: 'Services Marketplace', icon: <StoreIcon /> },
  { category: 'Marketing', label: 'Advertise', icon: <AdsClickIcon /> },
];

export default function MyAppsSection() {
  return (
    <Box minWidth={200}>
      {items.map((item, index) => (
        <Box key={index}>
          {item.category && (
            <Typography variant="caption" sx={{ mt: 2, fontWeight: 'bold', color: 'gray' }}>
              {item.category}
            </Typography>
          )}
          <List>
            <ListItem component="li">
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          </List>
        </Box>
      ))}
    </Box>
  );
}
