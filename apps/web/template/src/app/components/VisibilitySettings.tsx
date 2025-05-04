// "use client";

// import {
//   Box,
//   Paper,
//   Typography,
//   FormControlLabel,
//   Switch,
//   Select,
//   MenuItem,
//   CircularProgress,
// } from "@mui/material";
// import { useEffect, useState } from "react";
// import { useConnectionStore } from "../stores/useConnectionStore";

// interface VisibilitySettingsProps {
//   userId: number;
// }

// const VisibilitySettings: React.FC<VisibilitySettingsProps> = ({ userId }) => {
//   const fetchConnectionPreferences = useConnectionStore(
//     (state) => state.fetchConnectionPreferences
//   );
//   const preferences = useConnectionStore(
//     (state) => state.connectionPreferences
//   );

//   const [loading, setLoading] = useState(true);
//   const [localPrefs, setLocalPrefs] = useState({
//     allow_connection_requests: false,
//     allow_messages_from: "all",
//     visible_to_public: false,
//     visible_to_connections: false,
//     visible_to_network: false,
//     show_followers: false,
//   });

//   useEffect(() => {
//     const load = async () => {
//       if (userId) {
//         setLoading(true);
//         await fetchConnectionPreferences(userId);
//         setLoading(false);
//       }
//     };
//     load();
//   }, [userId, fetchConnectionPreferences]);

//   useEffect(() => {
//     if (preferences) {
//       setLocalPrefs(preferences);
//       console.log("🌐 Preferences loaded:", preferences);
//     }
//   }, [preferences]);

//   return (
//     <Paper elevation={3} sx={{ mb: 4, p: 2 }}>
//       <Typography variant="h6" sx={{ mb: 2 }}>
//         Visibility of your Ascend activity
//       </Typography>

//       {loading ? (
//         <Box display="flex" justifyContent="center" py={4}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <Box display="flex" flexDirection="column" gap={2}>
//           <FormControlLabel
//             control={
//               <Switch checked={localPrefs.allow_connection_requests} disabled />
//             }
//             label="Allow connection requests"
//           />
//           <FormControlLabel
//             control={<Switch checked={localPrefs.visible_to_public} disabled />}
//             label="Visible to public"
//           />
//           <FormControlLabel
//             control={
//               <Switch checked={localPrefs.visible_to_connections} disabled />
//             }
//             label="Visible to connections"
//           />
//           <FormControlLabel
//             control={
//               <Switch checked={localPrefs.visible_to_network} disabled />
//             }
//             label="Visible to network"
//           />
//           <FormControlLabel
//             control={<Switch checked={localPrefs.show_followers} disabled />}
//             label="Show followers"
//           />
//           <Box>
//             <Typography variant="body2" fontWeight="bold" mb={0.5}>
//               Allow messages from:
//             </Typography>
//             <Select
//               value={localPrefs.allow_messages_from}
//               fullWidth
//               disabled
//               size="small"
//             >
//               <MenuItem value="all">All</MenuItem>
//               <MenuItem value="connections-only">Connections only</MenuItem>
//             </Select>
//           </Box>
//         </Box>
//       )}
//     </Paper>
//   );
// };

// export default VisibilitySettings;
