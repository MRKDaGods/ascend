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
  Menu,
  ListItemIcon,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { useConnectionStore } from "../stores/useConnectionStore";

const ConnectionsList = () => {
  const theme = useTheme();
  const [sort, setSort] = useState("recent");
  const [searchTerm, setSearchTerm] = useState("");

  const { connections, fetchConnections, removeConnection } = useConnectionStore();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuUserId, setMenuUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchConnections(searchTerm);
  }, [searchTerm]);

  const sortedConnections = [...connections].sort((a, b) => {
    if (sort === "alphabetical") {
      return `${a.first_name} ${a.last_name}`.localeCompare(
        `${b.first_name} ${b.last_name}`
      );
    } else {
      return (
        new Date(b.connected_at).getTime() - new Date(a.connected_at).getTime()
      );
    }
  });

  const hasConnections = sortedConnections.length > 0;

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    userId: number
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuUserId(userId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuUserId(null);
  };

  const handleRemoveConnection = async (userId: number) => {
    await removeConnection(userId);
    handleMenuClose();
  };
  
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
      {/* Header */}
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
          {/* Sort */}
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

          {/* Search */}
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
                {/* Left: Avatar + Info */}
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

                {/* Right: Buttons */}
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
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, conn.user_id)}
                  >
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

          <Typography variant="body1" color="text.secondary">
            No connections found
          </Typography>
        </Box>
      )}

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => handleRemoveConnection(menuUserId!)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Remove connection
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ConnectionsList;
