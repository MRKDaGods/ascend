'use client';
import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { useJobStore } from '@/app/shared/store/useJobStore';
type TabValue = 'Saved' | 'In Progress' | 'Applied' | 'Archived';
const tabLabels: TabValue[] = ['Saved', 'In Progress', 'Applied', 'Archived'];

const JobTabs = () => {
  const { activeTab, setActiveTab } = useJobStore();

  const handleChange = (event: React.SyntheticEvent, newValue: TabValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={activeTab}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        aria-label="job status tabs"
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabLabels.map(label => (
          <Tab key={label} label={label} value={label} />
        ))}
      </Tabs>
    </Box>
  );
};

export default JobTabs;
