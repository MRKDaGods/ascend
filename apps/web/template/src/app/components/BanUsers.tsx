"use client";
import {
    Pagination,
    Typography,
    CircularProgress,
    Stack,
    Box,
  } from "@mui/material";
import { useState, useEffect } from "react";
import BannedUserCard from "./BannedUserCard";
import { getBannedUsers, unbanUser } from "@/app/utils/adminApi";


export default function BanUsers() {
     const [bans, setBans] = useState<any[]>([]);
      const [loading, setLoading] = useState(true);

      const fetchBans = async () => {
        setLoading(true);
        try {
          const response = await getBannedUsers();
          console.log("Fetched banned users:", response.data);
          setBans(response.data);
        } catch (error) {
          console.error("Error fetching reported posts:", error);
        } finally {
          setLoading(false);
        }
      };


      useEffect(() => {
        fetchBans();
      }, []);
      
      const handleUnbanUser = async (userId: number) => {
        if (!confirm("Are you sure you want to unban this user?")) return;
        try {
          await unbanUser(userId);
          fetchBans(); // refresh
        } catch (err) {
          console.error("Failed to unban user", err);
        }
      };

    
   return (
       <Box p={4}>
         <Typography variant="h4" fontWeight="bold" mb={4}
         aria-label="Banned users title"
         >
           Manage Banned Users
         </Typography>
         {loading ? (
           <CircularProgress
           aria-label="Loading banned users spinner"
            />
         ) : Array.isArray(bans) && bans.length > 0 ? (
           <Stack spacing={3}>
             {bans.map((b) => (
               <BannedUserCard
                 key={b.id}
                 ban={b}
                 onUnban={handleUnbanUser}
                 aria-label={`Banned user card for ${b.full_name || "user"}`}
               />
             ))}
           </Stack>
         ) : (
           <Typography
            aria-label="No banned users message"
           >
            No banned users found.
            </Typography>
         )}
        
       </Box>
     );
}