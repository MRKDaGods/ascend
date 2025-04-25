"use client";
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, useTheme } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import GroupsIcon from "@mui/icons-material/Groups";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import EventIcon from "@mui/icons-material/Event";
import { useRouter } from "next/navigation";

const QuickLinksCard = () => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Box
      onClick={() => router.push("/feed/saved-post")}
      sx={{
        p: 1.5,
        borderRadius: 2,
        width: "100%",
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        cursor: "pointer",
        "&:hover": { boxShadow: 2 },
      }}
    >
      <List dense>
        <ListItem>
          <ListItemIcon><BookmarkBorderIcon /></ListItemIcon>
          <ListItemText primary="Saved items" />
        </ListItem>
      </List>
    </Box>
  );
};

export default QuickLinksCard;
