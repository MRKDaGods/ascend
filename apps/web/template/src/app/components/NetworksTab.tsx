"use client";

import {
  Avatar,
  Box,
  Button,
  Divider,
  InputBase,
  Stack,
  Typography,
  useTheme,
  Tabs,
  Tab,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useConnectionStore } from "../stores/useConnectionStore";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const NetworkTabs = () => {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"followers" | "following">("followers");

  const {
    followers,
    fetchFollowers,
    connections,
    fetchConnections,
  } = useConnectionStore();

  const userId = Cookies.get("linkup_user_id");

  useEffect(() => {
    if (userId) {
      fetchFollowers(Number(userId));
      fetchConnections();
    }
  }, [userId]);

  const people =
    tab === "followers"
      ? followers
      : connections.filter((c) => c.user_id !== Number(userId));

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        width: "100%",
      }}
    >
      <Typography variant="h6" fontWeight={600} gutterBottom>
        My Network
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        sx={{ mb: 2 }}
      >
        <Tab value="following" label="Following" />
        <Tab value="followers" label="Followers" />
      </Tabs>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        mb={2}
        flexWrap="nowrap"
      >
        <Typography fontWeight={600}>
          {tab === "followers"
            ? `${followers.length} follower${followers.length !== 1 ? "s" : ""}`
            : `You are following ${people.length} people`}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            px: 1,
            py: 0.5,
            minWidth: 200,
            bgcolor: theme.palette.background.default,
          }}
        >
          <SearchIcon fontSize="small" sx={{ mr: 1 }} />
          <InputBase
            placeholder={`Search ${tab}`}
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ fontSize: "0.875rem" }}
          />
        </Box>
      </Stack>

      {people
        .filter((p) =>
          `${p.first_name} ${p.last_name}`
            .toLowerCase()
            .includes(search.toLowerCase())
        )
        .map((person) => (
          <Box key={person.user_id} mb={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                src={
                  person.profile_picture_id
                    ? `https://api.ascendx.tech/files/${person.profile_picture_id}`
                    : undefined
                }
              />
              <Box>
                <Typography fontWeight={600}>
                  {person.first_name} {person.last_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {person.bio || "--"}
                </Typography>
              </Box>
              <Box ml="auto">
                <Button variant="outlined" size="small" sx={{ borderRadius: 99 }}>
                  Following
                </Button>
              </Box>
            </Stack>
            <Divider sx={{ mt: 1 }} />
          </Box>
        ))}
    </Box>
  );
};

export default NetworkTabs;
