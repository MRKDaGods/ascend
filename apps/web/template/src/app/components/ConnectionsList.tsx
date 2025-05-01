"use client";

import {
  Box,
  Typography,
  InputBase,
  useTheme,
  MenuItem,
  FormControl,
  Select,
  Stack,
  Link,
  Avatar,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useEffect, useState } from "react";
import { useConnectionStore } from "../stores/useConnectionStore";

const ConnectionsList = () => {
  const theme = useTheme();
  const [sort, setSort] = useState("recent");
  const [searchTerm, setSearchTerm] = useState("");

  const { connections, fetchConnections } = useConnectionStore();

  useEffect(() => {
    fetchConnections(searchTerm);
  }, [searchTerm]);

  const sortedConnections = [...connections].sort((a, b) => {
    if (sort === "alphabetical") {
      return `${a.first_name} ${a.last_name}`.localeCompare(
        `${b.first_name} ${b.last_name}`
      );
    } else {
      return new Date(b.connected_at).getTime() - new Date(a.connected_at).getTime();
    }
  });

  const hasConnections = sortedConnections.length > 0;

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
      {/* Header Row */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        mb={2}
        flexWrap="nowrap"
      >
        <Typography fontWeight={600} variant="body1" sx={{ whiteSpace: "nowrap" }}>
          {connections.length} connections
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ flexGrow: 1, justifyContent: "flex-end", minWidth: 0 }}
        >
          {/* Sort dropdown */}
          <Box sx={{ display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mr: 1, whiteSpace: "nowrap" }}
            >
              Sort by:
            </Typography>
            <FormControl size="small" variant="outlined">
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                displayEmpty
                sx={{ fontSize: "0.875rem", minWidth: 140 }}
              >
                <MenuItem value="recent">Recently added</MenuItem>
                <MenuItem value="alphabetical">Alphabetical</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Search box */}
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
              placeholder="Search by name"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ fontSize: "0.875rem" }}
            />
          </Box>

          <Link href="#" variant="body2" underline="hover" sx={{ whiteSpace: "nowrap" }}>
            Search with filters
          </Link>
        </Stack>
      </Stack>

      <Divider sx={{ mb: 1 }} />

      {/* Connections List */}
      {hasConnections ? (
        <Box>
          {sortedConnections.map((conn) => (
            <Box key={conn.user_id}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                py={1.5}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    src={
                      conn.profile_picture_id
                        ? `https://api.ascendx.tech/files/${conn.profile_picture_id}`
                        : ""
                    }
                    sx={{ width: 56, height: 56 }}
                  />
                  <Box>
                    <Typography fontWeight={600} sx={{ fontSize: "0.95rem" }}>
                      {conn.first_name} {conn.last_name}
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
                      {conn.bio || "--"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      connected on {new Date(conn.connected_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      textTransform: "capitalize",
                      fontWeight: 600,
                      borderRadius: "20px",
                      px: 2,
                    }}
                  >
                    Message
                  </Button>
                  <IconButton size="small">
                    <MoreHorizIcon />
                  </IconButton>
                </Stack>
              </Stack>
              <Divider />
            </Box>
          ))}
        </Box>
      ) : (
        <Box textAlign="center" mt={5}>
          <Box
            component="img"
            src="/noconnections.jpg"
            alt="No connections"
            sx={{ maxWidth: 340, mx: "auto", mb: 2 }}
          />
          <Typography variant="body1" color="text.secondary">
            No results found
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ConnectionsList;
