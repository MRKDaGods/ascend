'use client';

import { Tabs, Tab, Box } from '@mui/material';

interface Props {
  value: number;
  onChange: (newValue: number) => void;
}

export default function MyJobsTabs({ value, onChange }: Props) {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 , mt: 2 }}>
      <Tabs value={value} onChange={(e, newVal) => onChange(newVal)}>
        <Tab label="Saved" />
        <Tab label="In Progress" />
        <Tab label="Applied" />
        <Tab label="Archived" />
      </Tabs>
    </Box>
  );
}
