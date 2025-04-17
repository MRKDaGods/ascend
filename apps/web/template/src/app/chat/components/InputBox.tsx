"use client";
import { Box, TextField, IconButton, Button, Typography } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { Message, useChatStore } from "../store/chatStore";
import React from "react";
import { extApi } from "@/api";
import { socket } from "../utils/socketHandler";

export default function InputBox() {
  const [messageText, setMessageText] = useState("");
  const [selectedFiles, setselectedFiles] = useState<File[]>([]);

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    appendMessageToConversation,
    updateLastMessage,
  } = useChatStore.getState();

  const selectedConversationId = useChatStore((state) => state.selectedConversationId);
  const convos = useChatStore((state) => state.conversations);
  const localUser = useChatStore((state) => state.localUser);


  //useEffect + setState -> rerender when said state changes 
  //clear input when selected conv changes
  useEffect(() => {
    setMessageText("");
  }, [selectedConversationId])

  //handle send when user clicks send
  const handleSend = async () => {
    if (selectedConversationId === null) return;

    try {
      const receiverId = convos.find((c) => c.conversationId == selectedConversationId)?.otherUserId;

      const res = await extApi.postForm("/messaging", {
        receiverId,
        content: messageText.trim(),
        file: selectedFiles.length > 0 ? selectedFiles[0] : undefined,
      }, {
        headers: {
          "x-no-parse-body": 1
        }
      });

      console.log("Send message response:", res);

      const newMessage: Message = res.data;
      newMessage.senderId = localUser!.user_id;
      console.log("Appending message to convo:", selectedConversationId, newMessage);

      if (newMessage) {
        appendMessageToConversation(selectedConversationId, newMessage);
        updateLastMessage(selectedConversationId, newMessage.content || "[Media]");

        // Manually scroll to bottom
        const chatWindowBottom = document.getElementById("chat-bottom");
        chatWindowBottom?.scrollIntoView({ behavior: "smooth" });
      }

      setMessageText("");
      setselectedFiles([]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  //emit typing when user types
  useEffect(() => {
    if (!messageText.trim()) return;
    const conversationId = useChatStore.getState().selectedConversationId; //just a snapshot to send with the typing event
    if (!conversationId) return;

    // later will emit to socket here:
    socket.emit("typing", { conversationId });

    console.log("Typing event for conversation", conversationId);

  }, [messageText]);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, padding: 1, borderTop: "1px solid #ccc", backgroundColor: "#fff" }}>
        <input
          data-testid="upload"
          type="file"
          multiple //to allow multiple file selection
          accept="image/*"
          ref={imageInputRef}
          style={{ display: "none" }}
          onChange={(e) => {
            const files = e.target.files;
            if (!files) return;
            const newFiles = Array.from(files); //convert the file list to arr
            setselectedFiles((prev) => [...prev, ...newFiles])
          }}
        />

        <input
          type="file"
          accept=".pdf,.doc,.docx,.mp4,.mov"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => {
            const files = e.target.files;
            if (!files) return;
            const newFiles = Array.from(files); //convert the file list to arr
            setselectedFiles((prev) => [...prev, ...newFiles])
          }}
        />
        <IconButton onClick={() => imageInputRef.current?.click()}>
          📷
        </IconButton>

        <IconButton onClick={() => fileInputRef.current?.click()}>
          📎
        </IconButton>

        <TextField
          placeholder="Write a message..."
          size="small"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />

        <Button
          sx={{ borderRadius: 9 }}
          variant="contained"
          onClick={handleSend}
          disabled={!messageText.trim() && selectedFiles.length === 0}
        >
          Send
        </Button>

      </Box>

      {/*remove and preview files*/}
      {selectedFiles.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {
            selectedFiles.map((file, index) => {
              const isImage = file.type.startsWith("image/");
              return (
                <Box
                  key={index}
                  sx={{
                    border: "1px solid #ddd",
                    width: isImage ? 100 : "auto",
                    position: "relative",
                    borderRadius: 2,
                    padding: 1
                  }}
                >
                  {/*remove button */}
                  <Button size="small"
                    onClick={() => setselectedFiles((prev) => prev.filter((_, i) => i !== index))}
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      color: "black",
                      minWidth: "unset", //shrink naturally
                      padding: "2px 6px",
                      fontSize: 15,
                      lineHeight: 1
                    }}
                  >
                    X
                  </Button>

                  {/*preview */}
                  {
                    isImage ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        style={{ width: "100%", borderRadius: 4 }}
                      />
                    ) :
                      <Typography fontSize="0.8rem">
                        {file.name}
                      </Typography>
                  }
                </Box>
              );
            })
          }
        </Box>
      )}
    </>
  );
}