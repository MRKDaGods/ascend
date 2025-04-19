'use client';

import React, { useState } from 'react';
import { Button, Popover } from '@mui/material';
import BusinessMenu from '@/app/components/BusinessMenu';

export default function HomePage() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div className="p-6">
      <Button variant="contained" onClick={handleClick}>
        Business
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: { width: 700 } }}
      >
        <BusinessMenu />
      </Popover>
    </div>
  );
}