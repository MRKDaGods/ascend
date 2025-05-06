import React from "react";
import {
  Box,
  Avatar,
  Typography,
  Divider,
  IconButton,
  ClickAwayListener,
  Card,
  CardContent,
  CardHeader,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { usePostStore } from "../stores/usePostStore";
import { useRouter } from "next/navigation";
import ConnectionUI from "./ConnectionUI";
import ConnectionMoreMenu from "./ConnectionMoreMenu";
import { useConnectionStore } from "../stores/useConnectionStore";

const SearchResults: React.FC = () => {
  const { searchResults, setSearchResults } = usePostStore();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const connectionStatuses = useConnectionStore(
    (state) => state.connectionStatuses
  );
  const fetchConnectionStatus = useConnectionStore(
    (state) => state.fetchConnectionStatus
  );

  if (!searchResults) return null;

  const { users, posts } = searchResults;

  const positionStyle = isMobile
    ? {
        top: "auto",
        left: 0,
        right: 0,
        bottom: 0,
        transform: "none",
        width: "100%",
        height: "70vh",
        borderRadius: "16px 16px 0 0",
      }
    : isTablet
    ? {
        top: "64px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxHeight: "70vh",
      }
    : {
        top: "64px",
        left: "30%",
        transform: "translateX(-50%)",
        width: "min(600px, 90%)",
        maxHeight: "70vh",
      };

  return (
    <ClickAwayListener onClickAway={() => setSearchResults(null)}>
      <Box
        sx={{
          position: "absolute",
          ...positionStyle,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: isMobile ? "16px 16px 0 0" : 2,
          overflowY: "auto",
          zIndex: 1300,
          boxShadow: 5,
          p: 2,
        }}
      >
        {/* Close Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 1,
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Search Results
          </Typography>
          <IconButton size="small" onClick={() => setSearchResults(null)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* USERS */}
        {users.length > 0 && (
          <>
            <Typography variant="h6" mb={1}>
              Users
            </Typography>
            {users.map((user) => {
              const status = connectionStatuses[user.id] || "notConnected";

              // Pre-fetch status if missing
              if (!connectionStatuses[user.id]) {
                fetchConnectionStatus(user.id);
              }

              return (
                <Box
                  key={user.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    mb: 2,
                    p: 1,
                    borderRadius: 2,
                    flexDirection: isMobile ? "column" : "row",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  {/* Left: avatar + name */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      flex: 1,
                      cursor: "pointer",
                      width: isMobile ? "100%" : "auto",
                    }}
                    onClick={() => {
                      router.push(`/profile?id=${user.id}`);
                      setSearchResults(null);
                    }}
                  >
                    <Avatar
                      src={
                        typeof user.profile_picture_url === "string" &&
                        user.profile_picture_url.startsWith("http")
                          ? user.profile_picture_url
                          : undefined
                      }
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography fontWeight="bold" noWrap>
                        {user.first_name} {user.last_name}
                      </Typography>
                      {user.bio && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {user.bio}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Right: Connect + More */}
                  <Box display="flex" alignItems="center" gap={1}>
                    <ConnectionUI userId={user.id} />
                    <ConnectionMoreMenu
                      userId={user.id}
                      firstName={user.first_name}
                      lastName={user.last_name}
                      isFollowing={false}
                      connectionStatus={status}
                      onRemoveConnection={() => {
                        useConnectionStore.getState().removeConnection(user.id);
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {/* POSTS */}
        {posts.length > 0 && (
          <>
            <Typography variant="h6" mb={1}>
              Posts
            </Typography>
            {posts.map((post) => (
              <Card
                key={post.id}
                sx={{
                  mb: 2,
                  p: { xs: 1, sm: 2 },
                  boxShadow: 2,
                  borderRadius: 3,
                  backgroundColor: "background.default",
                  cursor: "pointer", // Make card clickable
                }}
                onClick={() => {
                  router.push(`/feed/${post.id}`); // Redirect to post page
                }}
              >
                <CardHeader
                  sx={{ p: { xs: 1, sm: 2 } }}
                  avatar={
                    <Avatar
                      src={
                        typeof post.profilePic === "string" &&
                        post.profilePic.startsWith("http")
                          ? post.profilePic
                          : undefined
                      }
                    />
                  }
                  title={
                    <Typography fontWeight="bold">{post.username}</Typography>
                  }
                  subheader={
                    <Typography fontSize="0.75rem" color="text.secondary">
                      {post.timestamp}
                    </Typography>
                  }
                />
                <CardContent sx={{ pt: 0, p: { xs: 1, sm: 2 } }}>
                  <Typography
                    fontSize="1rem"
                    sx={{
                      wordBreak: "break-word",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {post.content}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </>
        )}

        {/* NO RESULTS */}
        {users.length === 0 && posts.length === 0 && (
          <Typography textAlign="center" color="text.secondary" py={4}>
            No results found. Try different keywords.
          </Typography>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default SearchResults;
