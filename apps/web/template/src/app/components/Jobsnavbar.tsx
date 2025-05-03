// // // Updated JobsNavbar.tsx
// // 'use client';

// // import React, { useState, useEffect, useRef } from "react";
// // import {
// //   AppBar,
// //   Toolbar,
// //   IconButton,
// //   Avatar,
// //   Menu,
// //   MenuItem,
// //   Typography,
// //   Box,
// //   Button,
// //   Paper,
// //   InputBase,
// //   Badge,
// //   useMediaQuery,
// //   Divider,
// //   List,
// //   ListItem,
// //   ListItemText,
// //   ListSubheader
// // } from "@mui/material";
// // import { styled, useTheme } from "@mui/material/styles";
// // import { Home, Work, Chat, Notifications, Search, MoreVert, History, Bookmark } from "@mui/icons-material";
// // import { useSearchStore } from "../stores/useSearchStore";
// // import { useRouter, usePathname } from "next/navigation";
// // import { useProfileStore } from "../stores/useProfileStore";

// // const SearchContainer = styled('div')(({ theme }) => ({
// //   display: 'flex',
// //   alignItems: 'center',
// //   backgroundColor: theme.palette.background.paper,
// //   border: `1px solid ${theme.palette.divider}`,
// //   borderRadius: '30px',
// //   padding: '4px 10px',
// // }));

// // const NavIconButton = styled(IconButton, {
// //   shouldForwardProp: (prop) => prop !== 'active',
// // })<{ active: boolean }>(({ theme, active }) => ({
// //   padding: 10,
// //   borderRadius: "20px",
// //   backgroundColor: active
// //     ? theme.palette.mode === "dark"
// //       ? "rgba(255, 255, 255, 0.1)"
// //       : "#f0f0f0"
// //     : "transparent",
// //   transition: "all 0.2s ease-in-out",
// //   "&:hover": {
// //     transform: "scale(1.1)",
// //     backgroundColor:
// //       theme.palette.mode === "dark"
// //         ? "rgba(255, 255, 255, 0.05)"
// //         : "#eaeaea",
// //   },
// // }));

// // const jobTitles = [
// //   "Software Engineer", "Product Manager", "Data Scientist", "UX Designer",
// //   "Full Stack Developer", "Frontend Developer", "Backend Developer",
// //   "Project Manager", "QA Engineer", "DevOps Engineer", "Sales Manager",
// //   "Marketing Manager", "Business Analyst", "Graphic Designer", "Data Analyst",
// //   "System Administrator", "Network Engineer", "Database Administrator",
// //   "Web Developer", "Mobile Developer"
// // ];

// // const SearchDropdown = styled(Paper)(({ theme }) => ({
// //   width: '300px',
// //   maxHeight: '400px',
// //   overflow: 'auto',
// //   marginTop: '5px',
// //   borderRadius: '8px',
// //   boxShadow: theme.shadows[3],
// // }));

// // const SearchListItem = styled(ListItem)(({ theme }) => ({
// //   padding: '8px 16px',
// //   '&:hover': {
// //     backgroundColor: theme.palette.action.hover,
// //     cursor: 'pointer',
// //   },
// // }));

// // const SearchListHeader = styled(ListSubheader)(({ theme }) => ({
// //   backgroundColor: theme.palette.background.paper,
// //   color: theme.palette.text.secondary,
// //   fontWeight: 600,
// //   padding: '8px 16px',
// //   lineHeight: '32px',
// // }));

// // const Jobsnavbar: React.FC = () => {
// //   // Static user data
// //   const staticUserData: UserData = {
// //     name: "Demo User",
// //     profilePhoto: "https://i.pravatar.cc/300",
// //     coverPhoto: "https://source.unsplash.com/random/1280x400/?gradient",
// //     role: "Software Engineer",
// //     entity: "Ascend",
// //     location: "New York, NY"
// //   };

// //   const [userData, setUserData] = useState<UserData | null>(null);
// //   const [isClient, setIsClient] = useState(false);
// //   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
// //   const [moreAnchorEl, setMoreAnchorEl] = useState<null | HTMLElement>(null);
// //   const [searchParams, setSearchParams] = useState({ title: "", location: "" });
// //   const [filteredTitles, setFilteredTitles] = useState<string[]>([]);
// //   const [showTitleDropdown, setShowTitleDropdown] = useState(false);
// //   const searchInputRef = useRef<HTMLInputElement>(null);
// //   const dropdownRef = useRef<HTMLDivElement>(null);
// //   const { recentSearches, addSearch, setRecentSearches } = useSearchStore();
// //   const router = useRouter();
// //   const pathname = usePathname();
// //   const theme = useTheme();
// //   const open = Boolean(anchorEl);
// //   const openMore = Boolean(moreAnchorEl);
// //   const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

// //   useEffect(() => {
// //     setIsClient(true);

// //     // BACKEND INTEGRATION NOTE:
// //     // Currently using static user data for development
// //     // TODO: Integrate with backend API to fetch actual user data
// //     // Expected response: UserData type (name, profilePhoto, etc.)
// //     // Implementation should update setUserData(data) with the actual response
    
// //     // Set static user data
// //     setUserData(staticUserData);
// //     setSearchParams((prev) => ({
// //       ...prev,
// //       location: staticUserData.location || "",
// //     }));


// //     const stored = localStorage.getItem("recentJobSearches");
// //     if (stored) {
// //       setRecentSearches(JSON.parse(stored));
// //     }
// //   }, [setRecentSearches]);

// //   const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
// //     setAnchorEl(event.currentTarget);
// //   };

// //   const handleMenuClose = () => {
// //     setAnchorEl(null);
// //   };

// //   const handleMoreOpen = (event: React.MouseEvent<HTMLElement>) => {
// //     setMoreAnchorEl(event.currentTarget);
// //   };

// //   const handleMoreClose = () => {
// //     setMoreAnchorEl(null);
// //   };

// //   // Filter for recommended titles
// //   const getRecommendedTitles = (): string[] => {
// //     if (!searchParams.title) {
// //       return jobTitles.slice(0, 5); // Show top 5 job titles when empty
// //     }
// //     return filteredTitles.slice(0, 5); // Show top 5 filtered results
// //   };

// //   // Get recent job title searches
// //   const getRecentTitleSearches = (): string[] => {
// //     return recentSearches
// //       .map(search => search.job)
// //       .filter((job, index, self) => job && self.indexOf(job) === index)
// //       .slice(0, 5); // Only show the 5 most recent unique job searches
// //   };

// //   const handleTitleClick = (title: string) => {
// //     setSearchParams(prev => ({ ...prev, title }));
// //     setShowTitleDropdown(false);
// //   };

// //   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const { name, value } = e.target;
// //     setSearchParams((prev) => ({ ...prev, [name]: value }));

// //     if (name === "title") {
// //       const filtered = jobTitles.filter((title) =>
// //         title.toLowerCase().includes(value.toLowerCase())
// //       );
// //       setFilteredTitles(filtered);
// //       setShowTitleDropdown(true); // Show dropdown when typing
// //     }
// //   };

// //   const handleSearch = () => {
// //     addSearch({ job: searchParams.title, location: searchParams.location });
// //     router.push(`/search?keyword=${encodeURIComponent(searchParams.title)}&location=${encodeURIComponent(searchParams.location)}`);
// //   };

// //   // Handle click outside to close dropdown
// //   useEffect(() => {
// //     const handleClickOutside = (event: MouseEvent) => {
// //       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
// //           searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
// //         setShowTitleDropdown(false);
// //       }
// //     };

// //     document.addEventListener('mousedown', handleClickOutside);
// //     return () => {
// //       document.removeEventListener('mousedown', handleClickOutside);
// //     };
// //   }, [dropdownRef, searchInputRef]);

// //   if (!isClient) return null;

// //   return (
// //     <AppBar elevation={0} sx={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary, borderBottom: `1px solid ${theme.palette.divider}`, position: "sticky" }}>
// //       <Toolbar sx={{ display: "flex", justifyContent: "space-between", flexDirection: isSmallScreen ? 'column' : 'row', alignItems: isSmallScreen ? 'center' : 'initial' }}>

// //         {/* LEFT */}
// //         <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
// //           <Typography variant="h5" color="primary" fontWeight="bold" sx={{ cursor: "pointer" }} onClick={() => router.push("/feed")}>
// //             Ascend
// //           </Typography>
// //         </Box>

// //         {/* CENTER */}
// //         <Box sx={{ display: "flex", alignItems: "center", flexGrow: 2, gap: 1, marginY: 1, flexDirection: isSmallScreen ? 'column' : 'row' }}>
// //           <Box sx={{ position: 'relative', width: isSmallScreen ? '130px' : '300px' }}>
// //             <SearchContainer>
// //               <Search sx={{ color: theme.palette.text.secondary, mr: 1 }} />
// //               <InputBase 
// //                 name="title" 
// //                 placeholder="Job title" 
// //                 value={searchParams.title} 
// //                 onChange={handleSearchChange}
// //                 onFocus={() => setShowTitleDropdown(true)}
// //                 inputRef={searchInputRef}
// //                 sx={{ fontSize: "0.85rem", width: "100%" }} 
// //                 data-testid="navbar-job-title-input" // Add data-testid to job title input
// //               />
// //             </SearchContainer>
            
// //             {showTitleDropdown && (
// //               <Box sx={{ position: 'absolute', width: '100%', zIndex: 1000 }} ref={dropdownRef}>
// //                 <SearchDropdown>
// //                   {getRecentTitleSearches().length > 0 && (
// //                     <>
// //                       <SearchListHeader>
// //                         Recent Searches
// //                       </SearchListHeader>
// //                       <List disablePadding>
// //                         {getRecentTitleSearches().map((title, index) => (
// //                           <SearchListItem key={`recent-${index}`} onClick={() => handleTitleClick(title)}>
// //                             <History fontSize="small" color="action" sx={{ marginRight: 1 }} />
// //                             <ListItemText primary={title} />
// //                           </SearchListItem>
// //                         ))}
// //                       </List>
// //                     </>
// //                   )}
                  
// //                   <SearchListHeader>
// //                     Recommended
// //                   </SearchListHeader>
// //                   <List disablePadding>
// //                     {getRecommendedTitles().map((title, index) => (
// //                       <SearchListItem key={`recommended-${index}`} onClick={() => handleTitleClick(title)}>
// //                         <Bookmark fontSize="small" color="primary" sx={{ marginRight: 1 }} />
// //                         <ListItemText primary={title} />
// //                       </SearchListItem>
// //                     ))}
// //                   </List>
// //                 </SearchDropdown>
// //               </Box>
// //             )}
// //           </Box>
          
// //           <SearchContainer sx={{ width: isSmallScreen ? '130px' : '300px' }}>
// //             <Search sx={{ color: theme.palette.text.secondary, mr: 1 }} />
// //             <InputBase 
// //               name="location" 
// //               placeholder="Location" 
// //               value={searchParams.location} 
// //               onChange={handleSearchChange} 
// //               sx={{ fontSize: "0.85rem", width: "100%" }} 
// //               data-testid="navbar-location-input" // Add data-testid to location input
// //             />
// //           </SearchContainer>
// //           <Button 
// //             variant="contained" 
// //             onClick={handleSearch}
// //             sx={{ borderRadius: '20px' }}
// //             data-testid="navbar-search-button" // Add data-testid to search button
// //           >
// //             Search
// //           </Button>
// //         </Box>

// //         {/* RIGHT */}
// //         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
// //           {isSmallScreen ? (
// //             <>
// //               <IconButton onClick={handleMoreOpen}><MoreVert /></IconButton>
// //               <Menu anchorEl={moreAnchorEl} open={openMore} onClose={handleMoreClose}>
// //                 <MenuItem onClick={() => router.push("/for-business")} data-testid="navbar-business-button">For Business</MenuItem>
// //                 <Divider />
// //                 <MenuItem onClick={() => alert('Premium Coming Soon')}>Try Premium</MenuItem>
// //               </Menu>
// //             </>
// //           ) : (
// //             <>
// //               <Button variant="text" onClick={() => router.push("/for-business")} sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.875rem", color: theme.palette.text.primary }} data-testid="navbar-business-button">
// //                 For Business
// //               </Button>
// //               <Button variant="contained" sx={{ backgroundColor: "#FFC107", color: "#000", textTransform: "none", borderRadius: 999, fontWeight: 600, px: 2.5, py: 1, fontSize: "0.875rem" }}>
// //                 Try Premium
// //               </Button>
// //             </>
// //           )}

// //           <NavIconButton active={pathname === "/feed"} onClick={() => router.push("/feed")}><Home /></NavIconButton>
// //           <NavIconButton active={pathname === "/jobs"} onClick={() => router.push("/jobs")}><Work /></NavIconButton>
// //           <NavIconButton active={pathname === "/messages"} onClick={() => router.push("/messages")}><Chat /></NavIconButton>
// //           <NavIconButton active={pathname === "/notifications"} onClick={() => router.push("/notifications")}>
// //             <Badge badgeContent={3} color="error">
// //               <Notifications />
// //             </Badge>
// //           </NavIconButton>
// //           <Avatar sx={{ width: 30, height: 30 }} src={userData?.profilePhoto} alt={userData?.name} onClick={handleMenuOpen} />
// //         </Box>

// //       </Toolbar>
// //     </AppBar>
// //   );
// // };

// // export default Jobsnavbar;
//  // HABIBA
//  "use client";

// import React, { useState, useEffect, useRef } from "react";
// import {
//   AppBar,
//   Toolbar,
//   IconButton,
//   Avatar,
//   Menu,
//   MenuItem,
//   Typography,
//   Box,
//   Button,
//   Paper,
//   InputBase,
//   Badge,
//   useMediaQuery,
//   Divider,
//   Tooltip,
//   List,
//   ListItem,
//   ListItemText,
//   ListSubheader,
//   ListItemIcon,
// } from "@mui/material";
// import { styled, useTheme } from "@mui/material/styles";
// import {
//   Home,
//   Work,
//   People,
//   Message,
//   Chat,
//   Notifications,
//   Search,
//   DarkMode,
//   LightMode,
//   Logout,
//   Settings,
//   History,
//   Bookmark,
//   ExpandMore
// } from "@mui/icons-material";
// import SettingsIcon from "@mui/icons-material/Settings";
// import LogoutIcon from "@mui/icons-material/Logout";

// import { useRouter, usePathname } from "next/navigation";
// import { useSearchStore } from "../stores/useSearchStore";
// import { useThemeStore } from "../stores/useThemeStore";
// import { useProfileStore } from "../stores/useProfileStore";
// import { useNotificationStore } from "../stores/useNotificationStore";
// import { useMenuStore } from "../stores/useMenuStore";
// import { api, refreshAuthState } from "@/api";

// const SearchContainer = styled("div")(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   backgroundColor: theme.palette.background.paper,
//   border: `1px solid ${theme.palette.divider}`,
//   borderRadius: "30px",
//   padding: "4px 10px",
// }));

// const SearchDropdown = styled(Paper)(({ theme }) => ({
//   width: "300px",
//   maxHeight: "400px",
//   overflow: "auto",
//   marginTop: "5px",
//   borderRadius: "8px",
//   boxShadow: theme.shadows[3],
// }));

// const SearchListItem = styled(ListItem)(({ theme }) => ({
//   padding: "8px 16px",
//   "&:hover": {
//     backgroundColor: theme.palette.action.hover,
//     cursor: "pointer",
//   },
// }));

// const SearchListHeader = styled(ListSubheader)(({ theme }) => ({
//   backgroundColor: theme.palette.background.paper,
//   color: theme.palette.text.secondary,
//   fontWeight: 600,
//   padding: "8px 16px",
//   lineHeight: "32px",
// }));

// const jobTitles = [
//   "Software Engineer",
//   "Product Manager",
//   "Data Scientist",
//   "UX Designer",
//   "Full Stack Developer",
//   "Frontend Developer",
//   "Backend Developer",
//   "Project Manager",
//   "QA Engineer",
//   "DevOps Engineer",
//   "Sales Manager",
//   "Marketing Manager",
//   "Business Analyst",
//   "Graphic Designer",
//   "Data Analyst",
//   "System Administrator",
//   "Network Engineer",
//   "Database Administrator",
//   "Web Developer",
//   "Mobile Developer",
// ];

// // 🎯 Active nav highlight
// const NavIconButton = styled(IconButton, {
//   shouldForwardProp: (prop) => prop !== "active",
// })<{ active: boolean }>(({ theme, active }) => ({
//   padding: 10,
//   borderRadius: "12px",
//   backgroundColor: active
//     ? theme.palette.mode === "dark"
//       ? "rgba(255, 255, 255, 0.1)"
//       : "#f0f0f0"
//     : "transparent",
//   transition: "all 0.2s ease-in-out",
//   "&:hover": {
//     transform: "scale(1.1)",
//     backgroundColor:
//       theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "#eaeaea",
//   },
// }));

// const MergeJobsNavbar: React.FC = () => {
//   const theme = useTheme();
//   const muiTheme = useTheme();
//   const router = useRouter();
//   const pathname = usePathname();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

//   const { theme: appTheme, toggleTheme } = useThemeStore();
//   const { notifications } = useNotificationStore();
//   const unseenCount = notifications.filter((n) => !n.is_read).length;
//   const { anchorEl, setAnchorEl, closeMenu } = useMenuStore();
//   const { recentSearches, addSearch, setRecentSearches } = useSearchStore();
//   const [searchParams, setSearchParams] = useState({ title: "", location: "" });
//   const [filteredTitles, setFilteredTitles] = useState<string[]>([]);
//   const [showTitleDropdown, setShowTitleDropdown] = useState(false);

//   const searchInputRef = useRef<HTMLInputElement>(null);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   // const menuOpen = Boolean(anchorEl);

//   const userData = useProfileStore((state) => state.userData);
//   const profilePicture = userData?.profile_picture_url || "/default-avatar.png";
//   const fullName = userData
//     ? `${userData.first_name} ${userData.last_name}`
//     : "User";

//   useEffect(() => {
//     const stored = localStorage.getItem("recentJobSearches");
//     if (stored) {
//       setRecentSearches(JSON.parse(stored));
//     }
//   }, [setRecentSearches]);

//   const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setSearchParams((prev) => ({ ...prev, [name]: value }));

//     if (name === "title") {
//       const filtered = jobTitles.filter((title) =>
//         title.toLowerCase().includes(value.toLowerCase())
//       );
//       setFilteredTitles(filtered);
//       setShowTitleDropdown(true); // Show dropdown when typing
//     }
//   };

//   const handleSearch = () => {
//     addSearch({ job: searchParams.title, location: searchParams.location });
//     router.push(`/jobs/search?keyword=${encodeURIComponent(searchParams.title)}&location=${encodeURIComponent(searchParams.location)}`);
//   };

//   const handleTitleClick = (title: string) => {
//     setSearchParams((prev) => ({ ...prev, title }));
//     setShowTitleDropdown(false);
//   };

//   const getRecommendedTitles = (): string[] => {
//     if (!searchParams.title) {
//       return jobTitles.slice(0, 5); // Show top 5 job titles when empty
//     }
//     return filteredTitles.slice(0, 5); // Show top 5 filtered results
//   };

//   const getRecentTitleSearches = (): string[] => {
//     return recentSearches
//       .map((search) => search.job)
//       .filter((job, index, self) => job && self.indexOf(job) === index)
//       .slice(0, 5); // Only show the 5 most recent unique job searches
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node) &&
//         searchInputRef.current &&
//         !searchInputRef.current.contains(event.target as Node)
//       ) {
//         setShowTitleDropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [dropdownRef, searchInputRef]);

//   const handleLogout = () => {
//     api.auth
//       .logout()
//       .then(() => {
//         console.log("Logout successful");
//         console.log("auth tk:", localStorage.getItem("auth_token"));
//         refreshAuthState();
//         router.push("/authen");
//       })
//       .catch((error) => {
//         console.error("Logout error:", error);
//       });
//   };

//   return (
//     <AppBar
//   elevation={0}
//   sx={{
//     backgroundColor: muiTheme.palette.background.paper,
//     color: muiTheme.palette.text.primary,
//     borderBottom: `1px solid ${muiTheme.palette.divider}`,
//     position: "sticky",
//     height: 64, // Match the height of Navbar
//   }}
// >
//   <Toolbar
//     sx={{
//       display: "flex",
//       justifyContent: "space-between",
//       py: 1, // Match the padding of Navbar
//       minHeight: 64, // Ensure the Toolbar matches the AppBar height
//     }}
//   >
//     {/* LEFT */}
//     <Box sx={{ display: "flex", alignItems: "center", py: 1 }}>
//       <img
//         src="/logoIcon.png"
//         alt="Ascend"
//         style={{ height: 36, borderRadius: 6 }}
//       />
//       <Box
//         onClick={() => router.push("/feed")}
//         sx={{ cursor: "pointer" }} // Add pointer cursor to indicate it's clickable
//       >
//         <Typography variant="h5" color="primary" fontWeight="bold">
//           Ascend
//         </Typography>
//       </Box>
//     </Box>

//     {/* CENTER */}
//     <Box
//   sx={{
//     display: "flex",
//     alignItems: "center",
//     flexGrow: 2,
//     gap: 1,
//     marginY: 1,
//     flexDirection: isSmallScreen ? "column" : "row",
//   }}
// >
//   {/* Job Title Search */}
//   <Box sx={{ position: "relative", width: "270px" }}> {/* Updated width */}
//     <SearchContainer>
//       <Search sx={{ color: theme.palette.text.secondary, mr: 1 }} />
//       <InputBase
//         name="title"
//         placeholder="Job title"
//         value={searchParams.title}
//         onChange={handleSearchChange}
//         onFocus={() => setShowTitleDropdown(true)}
//         inputRef={searchInputRef}
//         sx={{ fontSize: "0.85rem", width: "100%" }}
//       />
//     </SearchContainer>

//     {showTitleDropdown && (
//       <Box
//         sx={{ position: "absolute", width: "100%", zIndex: 1000 }}
//         ref={dropdownRef}
//       >
//         <SearchDropdown>
//           {getRecentTitleSearches().length > 0 && (
//             <>
//               <SearchListHeader>Recent Searches</SearchListHeader>
//               <List disablePadding>
//                 {getRecentTitleSearches().map((title, index) => (
//                   <SearchListItem
//                     key={`recent-${index}`}
//                     onClick={() => handleTitleClick(title)}
//                   >
//                     <History fontSize="small" color="action" sx={{ marginRight: 1 }} />
//                     <ListItemText primary={title} />
//                   </SearchListItem>
//                 ))}
//               </List>
//             </>
//           )}

//           <SearchListHeader>Recommended</SearchListHeader>
//           <List disablePadding>
//             {getRecommendedTitles().map((title, index) => (
//               <SearchListItem
//                 key={`recommended-${index}`}
//                 onClick={() => handleTitleClick(title)}
//               >
//                 <Bookmark fontSize="small" color="primary" sx={{ marginRight: 1 }} />
//                 <ListItemText primary={title} />
//               </SearchListItem>
//             ))}
//           </List>
//         </SearchDropdown>
//       </Box>
//     )}
//   </Box>

//   {/* Location Search */}
//   <SearchContainer sx={{ width: "270px" }}> {/* Updated width */}
//     <Search sx={{ color: theme.palette.text.secondary, mr: 1 }} />
//     <InputBase
//       name="location"
//       placeholder="Location"
//       value={searchParams.location}
//       onChange={handleSearchChange}
//       sx={{ fontSize: "0.85rem", width: "100%" }}
//     />
//   </SearchContainer>

//   {/* Search Button */}
//   <Button
//     variant="contained"
//     onClick={handleSearch}
//     sx={{ borderRadius: "20px" }}
//   >
//     Search
//   </Button>
// </Box>

//     {/* RIGHT */}
//     <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//       <Tooltip
//         title={
//           appTheme === "dark"
//             ? "Switch to Light Mode"
//             : "Switch to Dark Mode"
//         }
//       >
//         <IconButton onClick={toggleTheme}>
//           {appTheme === "dark" ? (
//             <LightMode sx={{ color: "#ffeb3b" }} />
//           ) : (
//             <DarkMode sx={{ color: "#333" }} />
//           )}
//         </IconButton>
//       </Tooltip>

//       <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
//         {[
//           { icon: <Home />, route: "/home", label: "Home" },
//           { icon: <Work />, route: "/work", label: "Work" },
//           { icon: <People />, route: "/people", label: "People" },
//           { icon: <Message />, route: "/messages", label: "Messages" },
//           { icon: <Notifications />, route: "/notifications", label: "Notifications" },
//         ].map(({ icon, route, label }, i) => (
//           <Tooltip key={i} title={label}>
//             <NavIconButton
//               onClick={() => router.push(route)}
//               active={pathname === route}
//             >
//               {label === "Notifications" && unseenCount > 0 ? (
//                 <Badge badgeContent={unseenCount} color="error">
//                   {React.cloneElement(icon, {
//                     sx: { color: muiTheme.palette.text.secondary },
//                   })}
//                 </Badge>
//               ) : (
//                 React.cloneElement(icon, {
//                   sx: { color: muiTheme.palette.text.secondary },
//                 })
//               )}
//             </NavIconButton>
//           </Tooltip>
//         ))}
//       </Box>

//       {/* Avatar with Menu */}
//       <Tooltip title="Me">
//         <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
//           <Avatar
//             src={profilePicture}
//             alt={fullName}
//             sx={{
//               transition: "0.3s",
//               "&:hover": { transform: "scale(1.1)" },
//             }}
//           />
//         </IconButton>
//       </Tooltip>
//     </Box>
//   </Toolbar>
// </AppBar>
//     );
// };

// export default MergeJobsNavbar;