"use client";

import {
  Box,
  Typography,
  Tabs,
  Tab,
  Avatar,
  Stack,
  Divider,
  Button,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";

// Dummy data for now (to be fetched from backend later)
const dummyFollowing = [
  {
    id: 1,
    name: "Yasmin Essam",
    title: "Frontend Engineer at Siemens Digital Industries Software",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    id: 2,
    name: "Hamid Naderi Yeganeh",
    title: "Mathematical Artist. Research Student at UCL Maths.",
    avatar: "https://randomuser.me/api/portraits/men/34.jpg",
  },
  {
    id: 3,
    name: "Ryan Peterman",
    title: "AI/ML Infra @ Meta | Writing About Software Engineering & Career Growth",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  },
];

const dummyFollowers = [
  {
    id: 1,
    name: "Mahmoud Zayed",
    title: "Graphic Designer & Instructor",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    id: 2,
    name: "Habiba El Hiny",
    title: "Senior Electrical Energy Engineering student (EEE), Cairo University",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
  },
];

const FollowList = () => {
  const theme = useTheme();
  const [tab, setTab] = useState(0);

  const currentList = tab === 0 ? dummyFollowing : dummyFollowers;

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        width: "100%",
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
      }}
    >
      {/* Title */}
      <Typography fontWeight={600} variant="h6" mb={2}>
        Habiba’s Network
      </Typography>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 2 }}
      >
        <Tab label="Following" />
        <Tab label="Followers" />
      </Tabs>

      {/* Info Text */}
      <Typography variant="body2" color="text.secondary" mb={2}>
        {tab === 0
          ? `You are following ${dummyFollowing.length} people out of your network`
          : `You have ${dummyFollowers.length} followers`}
      </Typography>

      {/* List */}
      {currentList.map((user) => (
        <Box key={user.id}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            py={1.5}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={user.avatar} sx={{ width: 48, height: 48 }} />
              <Box>
                <Typography fontWeight={600} sx={{ fontSize: "0.95rem" }}>
                  {user.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    maxWidth: "300px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.title}
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="outlined"
              size="small"
              sx={{
                borderRadius: "20px",
                textTransform: "capitalize",
                fontWeight: 600,
                px: 2,
              }}
            >
              {tab === 0 ? "Following" : "Follower"}
            </Button>
          </Stack>
          <Divider />
        </Box>
      ))}
    </Box>
  );
};

export default FollowList;
