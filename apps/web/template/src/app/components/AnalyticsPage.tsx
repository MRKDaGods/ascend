'use client';

import { Box, Button, Typography, Paper, Divider, MenuItem, Select } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useState } from 'react';

export default function AnalyticsPage() {
  const [selectedMetric, setSelectedMetric] = useState('Impressions');

  return (
    <Box sx={{ flex: 1, p: 4 }}>
      <Paper sx={{backgroundColor: 'white', p: 3, mb: 4}}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Analytics
        </Typography>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight={600}>
          Job application
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          {['Pending', 'Viewed', 'Accepted', 'Rejected'].map((item) => (
            <Box key={item} sx={{ textAlign: 'center' }}>
              <Typography fontWeight={600} fontSize={24}>0</Typography>
              <Typography>{item}</Typography>
              <Typography variant="caption" color="text.secondary">0%</Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>Metrics</Typography>
        <Select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          sx={{ mb: 2, width: 200 }}
        >
          <MenuItem value="Pending" defaultChecked>Pending</MenuItem>
          <MenuItem value="Viewed">Viewed</MenuItem>
          <MenuItem value="Accepted">Accepted</MenuItem>
          <MenuItem value="Rejected">Rejected</MenuItem>
        </Select>
        <Typography variant="body2">No data to display.</Typography>
      </Paper>
    </Box>
  );
}
