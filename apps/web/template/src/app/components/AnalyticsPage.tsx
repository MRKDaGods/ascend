'use client';

import { Box, Button, Typography, Paper, Divider, MenuItem, Select } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useState } from 'react';

export default function AnalyticsPage() {
  const [selectedMetric, setSelectedMetric] = useState('Impressions');

  return (
    <Box id="analytics-page" sx={{ flex: 1, p: 4 }}>
      <Paper id="analytics-header" sx={{ backgroundColor: 'white', p: 3, mb: 4 }}>
        <Typography id="analytics-title" variant="h5" fontWeight={600} gutterBottom>
          Analytics
        </Typography>
      </Paper>

      <Paper id="job-application-section" variant="outlined" sx={{ p: 3, mb: 4 }}>
        <Typography id="job-application-title" variant="h6" fontWeight={600}>
          Job application
        </Typography>

        <Box id="job-application-stats" sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          {['Pending', 'Viewed', 'Accepted', 'Rejected'].map((item) => (
            <Box key={item} id={`job-application-stat-${item.toLowerCase()}`} sx={{ textAlign: 'center' }}>
              <Typography id={`stat-value-${item.toLowerCase()}`} fontWeight={600} fontSize={24}>0</Typography>
              <Typography id={`stat-label-${item.toLowerCase()}`}>{item}</Typography>
              <Typography id={`stat-percentage-${item.toLowerCase()}`} variant="caption" color="text.secondary">0%</Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      <Paper id="metrics-section" variant="outlined" sx={{ p: 3 }}>
        <Typography id="metrics-title" variant="h6" fontWeight={600} mb={2}>Metrics</Typography>
        <Select
          id="metrics-select"
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          sx={{ mb: 2, width: 200 }}
        >
          <MenuItem id="metric-option-pending" value="Pending" defaultChecked>Pending</MenuItem>
          <MenuItem id="metric-option-viewed" value="Viewed">Viewed</MenuItem>
          <MenuItem id="metric-option-accepted" value="Accepted">Accepted</MenuItem>
          <MenuItem id="metric-option-rejected" value="Rejected">Rejected</MenuItem>
        </Select>
        <Typography id="metrics-no-data" variant="body2">No data to display.</Typography>
      </Paper>
    </Box>
  );
}
