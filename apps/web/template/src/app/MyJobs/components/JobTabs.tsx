'use client';
import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { useJobStore } from '@/app/shared/store/useJobStore';

type TabValue = 'Saved' | 'Applied' | 'Posted';

const tabLabels: TabValue[] = ['Saved', 'Applied','Posted'];

const JobTabs = () => {
  const { activeTab, setActiveTab } = useJobStore();

  const handleChange = (event: React.SyntheticEvent, newValue: TabValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        backgroundColor: '#fff',
        boxShadow: '0px 2px 8px rgba(0,0,0,0.05)',
        borderRadius: 2,
        px: 2,
      }}
    >
      <Tabs
        value={activeTab}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        aria-label="job status tabs"
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          '.MuiTab-root': {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.95rem',
            px: 2,
            py: 1,
          },
        }}
      >
        {tabLabels.map((label) => (
          <Tab key={label} label={label} value={label} />
        ))}
      </Tabs>
    </Box>
  );
};

export default JobTabs;
