"use client";
import { Tabs, Tab, Box } from "@mui/material";
import { useState } from "react";
import AdminCreateUser from "@/app/components/AdminCreateUser";
import BanUsers from "@/app/components/BanUsers";
import ManageUserReports from "@/app/components/ManageUserReports";

export default function ManageUsers() {
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };
  return (
    <Box p={4}>
      <h1>Manage Users</h1>
      <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth">
        <Tab label="Create User" />
        <Tab label="Ban Users" />
        <Tab label="Manage User Reports" />
      </Tabs>
      <Box p={2}>
        {tabIndex === 0 && <AdminCreateUser />}
        {tabIndex === 1 && <BanUsers />}
        {tabIndex === 2 && <ManageUserReports />}
      </Box>
    </Box>
  );
}
