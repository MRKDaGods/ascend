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
import { useState } from "react";

// Dummy connections (replace with backend API later)
const dummyConnections = [
  {
    id: 1,
    name: "Mariam Mohamed",
    jobTitle: "--",
    connectedDate: "April 25, 2025",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: 2,
    name: "Chandler Bing",
    jobTitle: "Student at Cairo University Faculty of Engineering, Computer Engineering.",
    connectedDate: "April 25, 2025",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 3,
    name: "Phoebe Buffay",
    jobTitle: "Electronics and Electrical Communications Engineering Student at Cairo University",
    connectedDate: "April 24, 2025",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
  },
];

const ConnectionsList = () => {
  const theme = useTheme();
  const [sort, setSort] = useState("recent");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConnections = dummyConnections.filter((conn) =>
    conn.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasConnections = filteredConnections.length > 0;

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
  flexWrap="nowrap"
  spacing={2}
  mb={2}
>
  {/* Left: Connections count */}
  <Typography fontWeight={600} variant="body1" sx={{ whiteSpace: "nowrap" }}>
    {dummyConnections.length} connections
  </Typography>

  {/* Right: Sort + Search + Filter */}
  <Stack
    direction="row"
    alignItems="center"
    spacing={2}
    flexWrap="nowrap"
    sx={{ flexGrow: 1, justifyContent: "flex-end", minWidth: 0 }}
  >
    {/* Sort dropdown */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        whiteSpace: "nowrap",
      }}
    >
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
          inputProps={{ "aria-label": "Sort connections" }}
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

    {/* Filter link */}
    <Link href="#" variant="body2" underline="hover" sx={{ whiteSpace: "nowrap" }}>
      Search with filters
    </Link>
  </Stack>
</Stack>


      {/* Divider between header and list */}
      <Divider sx={{ mb: 1 }} />

      {/* Connections List */}
      {hasConnections ? (
        <Box>
          {filteredConnections.map((conn) => (
            <Box key={conn.id}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                py={1.5}
              >
                {/* Left: Avatar + Name + Info */}
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar src={conn.avatar} sx={{ width: 56, height: 56 }} />
                  <Box>
                    <Typography fontWeight={600} sx={{ fontSize: "0.95rem" }}>
                      {conn.name}
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
                      {conn.jobTitle}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      connected on {conn.connectedDate}
                    </Typography>
                  </Box>
                </Stack>

                {/* Right: Message Button + 3 Dots */}
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

              {/* Divider between connections */}
              <Divider />
            </Box>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            mt: 5,
          }}
        >
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
