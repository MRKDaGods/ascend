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
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import EventIcon from "@mui/icons-material/Event";
import PagesIcon from "@mui/icons-material/Pages";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import { useRouter } from "next/navigation";

const ManageNetworkCard = () => {
  const theme = useTheme();
  const router = useRouter();

  const items = [
    { text: "Connections", icon: <PeopleIcon />, route: "/network/connections" },
    { text: "Following & followers", icon: <PersonIcon />, route: "/network/following" },
    { text: "Groups", icon: <GroupsIcon />, route: "/network/connections" },
    { text: "Events", icon: <EventIcon />, route: "/network/connections" },
    { text: "Pages", icon: <PagesIcon />, route: "/network/connections" },
    { text: "Newsletters", icon: <NewspaperIcon />, route: "/network/connections" },
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
        Manage my network
      </Typography>
      <List dense>
        {items.map((item) => (
          <ListItem
            key={item.text}
            sx={{ cursor: "pointer" }}
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

export default ManageNetworkCard;
