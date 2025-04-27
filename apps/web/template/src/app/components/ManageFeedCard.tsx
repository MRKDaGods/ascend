// Component file: card showing connections and saved items in feed main page

"use client";

import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useRouter } from "next/navigation";

const ManageFeedCard = () => {
  const theme = useTheme();
  const router = useRouter();

  const items = [
    { text: "Connections", icon: <PeopleAltIcon />, route: "/network" },
    { text: "Saved Items", icon: <BookmarkBorderIcon />, route: "/feed/saved-post" },
  ];

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
      <Typography variant="subtitle1" fontWeight={600} mb={1}>
        Manage my feed
      </Typography>
      <List dense>
        {items.map((item) => (
          <ListItem
            key={item.text}
            id={`manage-feed-${item.text.toLowerCase().replace(/\s+/g, "-")}-button`}
            sx={{
              cursor: "pointer",
              borderRadius: 2,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
            onClick={() => router.push(item.route)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ManageFeedCard;
