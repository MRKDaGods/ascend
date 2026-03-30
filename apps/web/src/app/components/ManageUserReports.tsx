"use client";

import {
    Pagination,
    Typography,
    CircularProgress,
    Stack,
    Box,
  } from "@mui/material";
import { useState, useEffect } from "react";
import ReportedUserCard from "./ReportedUserCard";
import { getUserReports, banUser, deleteUser,deleteReport } from "@/app/utils/adminApi";


export default function ManageUserReports() {
    const [reports, setReports] = useState<any[]>([]);
          const [loading, setLoading] = useState(true);
    
          const fetchUserReports = async () => {
            setLoading(true);
            try {
              const response = await getUserReports();
              console.log("Fetched reported users:", response.data);
              setReports(response.data);
            } catch (error) {
              console.error("Error fetching reported users:", error);
            } finally {
              setLoading(false);
            }
          };
    
    
          useEffect(() => {
            fetchUserReports();
          }, []);
          
          const handleBanUser = async (reportId:number, userId: number) => {
            if (!confirm("Are you sure you want to ban this user?")) return;
            try {
              await banUser(userId);
              await deleteReport(reportId); // delete the report after banning the user
              fetchUserReports(); // refresh
            } catch (err) {
              console.error("Failed to ban user", err);
            }
          };
    
          const handleDeleteUser = async (userId: number) => {
            if (!confirm("Are you sure you want to delete this user?")) return;
            try {
              await deleteUser(userId);
              fetchUserReports(); // refresh
            } catch (err) {
              console.error("Failed to delete user", err);
            }
          };

          const handleDeleteReport = async (reportId: number) => {
            if (!confirm("Are you sure you want to delete this report?")) return;
            try {
              await deleteReport(reportId);
              fetchUserReports(); // refresh
            } catch (err) {
              console.error("Failed to delete report", err);
            }
          };

        
       return (
           <Box p={4}>
             <Typography variant="h4" fontWeight="bold" mb={4}
             aria-label="Manage Reported Users heading"
             >
               Manage Reported Users
             </Typography>
             {loading ? (
               <CircularProgress 
               aria-label="Loading spinner for reported users"
               />
             ) : Array.isArray(reports) && reports.length > 0 ? (
               <Stack spacing={3}>
                 {reports.map((r) => (
                   <ReportedUserCard
                     key={r.id}
                     report ={r}
                     onBanUser={handleBanUser}
                     onDeleteUser={handleDeleteUser}
                     onDeleteReport={handleDeleteReport}
                     aria-label={`Reported user card for ${r.full_name || "user"}`}
                   />
                 ))}
               </Stack>
             ) : (
               <Typography
               aria-label="No reported users found message"
               >
                No reported users found.</Typography>
             )}
            
           </Box>
         );
}