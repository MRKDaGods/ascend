"use client";
import { Box, Avatar, Paper, Typography } from "@mui/material";
import { Message, useChatStore } from "../store/chatStore";
import React from "react";
import { api } from "@/api";

function formatTime(date: Date): string {
  const now = new Date();

  if (date instanceof Date === false) {
    date = new Date(date);
  }

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) {
    return "Yesterday";
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });

}

export default function MessageItem({ message }: { message: Message }) {
  const { messageId, senderId, content, fileUrl, fileType, sentAt, readAt, isRead }: Message = message;

  const conversations = useChatStore((state) => state.conversations);
  const selectedConversationId = useChatStore((state) => state.selectedConversationId);
  const localUser = useChatStore((state) => state.localUser);

  if (!localUser) {
    return null;
  }

  const isSentByYou = senderId === localUser.user_id;
  const conversation = conversations.find((c) => c.conversationId === selectedConversationId);
  const isBlockedByPartner = conversation?.isBlocked;
  const displayName = !isSentByYou && isBlockedByPartner
    ? "LinkedIn User"
    : !isSentByYou ? conversation?.otherUserFullName : `${localUser.first_name} ${localUser.last_name}`;

  //console.log("Message rendered", { content, sender, status, isSentByYou });


  return (
    <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", mb: 2 }}>
      {/* TODO: shel replace */}
      <Avatar
        src={
          !isSentByYou && isBlockedByPartner
            ? ""
            : !isSentByYou
              ? conversation?.otherUserProfilePictureUrl?.replace("http://api.ascendx.tech", api.baseUrl)
              : localUser.profile_picture_url?.replace("http://api.ascendx.tech", api.baseUrl)
        }
        alt={displayName}
        sx={{ width: 50, height: 50 }}
      >
        {!isSentByYou && isBlockedByPartner ? "" : (displayName?.charAt(0) || "?")}
      </Avatar>


      <Paper elevation={0}

        sx={{
          width: "fit-content",
          maxWidth: "100%", // ✅ Allow to expand fully
          p: 0.5,
          borderRadius: "8px",
          overflowWrap: "break-word",
          wordBreak: "break-word",
        }}
      >


        { /*sender name*/}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
            {displayName}
          </Typography>

          <Typography variant="caption" sx={{ color: "gray", fontWeight: "bold" }}>
            &middot;
          </Typography>

          <Typography variant="caption" sx={{ color: "gray" }}>

            {formatTime(sentAt)}
          </Typography>
        </Box>


        { /*text content*/}
        {
          content && (
            <Typography sx={{ wordBreak: "break-word" }}>
              {content}
            </Typography>
          )
        }

        { /*media*/}
        {
          fileUrl && fileType && (() => {
            {
              const isImage = fileType.startsWith("image/");
              const isVideo = fileType.startsWith("video/");

              const fixedUrl = fileUrl.replace("http://api.ascendx.tech", api.baseUrl);
              if (isImage) {
                return (
                  <Box>
                    <img src={fixedUrl} alt="media" style={{
                      maxWidth: "400px", // ✅ Responsive cap
                      width: "100%",     // ✅ Stretches to parent
                      height: "auto",
                      borderRadius: 8,
                      marginTop: 8,
                    }} />
                  </Box>
                );
              } else if (isVideo) {
                return (
                  <Box>
                    <video data-testid="video-element" src={fixedUrl} controls style={{
                      maxWidth: "400px",
                      width: "100%",
                      borderRadius: 8,
                      marginTop: 8,
                    }} />
                  </Box>
                );
              } else {
                return (
                  <Box>
                    <Typography component="a"
                      href={fixedUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: "#1976d2",
                        fontWeight: 500,
                        "&:hover": {
                          textDecoration: "underline",
                          color: "#1565c0"
                        }

                      }}>
                      📄 Download file
                    </Typography>
                  </Box>
                );
              }
            }
          })()
        }

        {/* read receipts */}
        {
          isSentByYou && (
            <Typography fontSize="0.75rem" color="gray" mt={0.5}>
              {isRead ? "✔️✔️" : "✔️"} {readAt ? formatTime(readAt) : "Sent"}
            </Typography>
          )
        }
      </Paper>
    </Box>
  );
}

