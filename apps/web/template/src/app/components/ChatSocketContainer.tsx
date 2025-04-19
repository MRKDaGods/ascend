import { Message, useChatStore } from "@/app/stores/chatStore";
import { useCallback, useEffect, useState } from "react";
import { handleIncomingMessage, handleIncomingMessageRead, socket } from "../utils/socketHandler";
import { api } from "@/api";
import { Box, Typography } from "@mui/material";

export default function ChatSocketContainer({ children }: { children: React.ReactNode }) {
    const [fetchingUserData, setFetchingUserData] = useState(true);
    const [err, setErr] = useState<string | null>(null);
    const [authToken, setAuthToken] = useState<string | null>(null);
    const setLocalUser = useChatStore((state) => state.setLocalUser);

    const appendMessageToConversation = useChatStore((state) => state.appendMessageToConversation);
    const updateLastMessage = useChatStore((state) => state.updateLastMessage);
    const setUnreadMessagesById = useChatStore((state) => state.setUnreadMessagesById);
    const selectedConversationId = useChatStore((state) => state.selectedConversationId);
    const setMessagesForConversation = useChatStore((state) => state.setMessagesForConversation);
    const messagesByConversation = useChatStore((state) => state.messagesByConversation);

    const handleIncomingMessageCallback = useCallback((data: any) =>
        handleIncomingMessage(data as Message,
            selectedConversationId,
            appendMessageToConversation,
            updateLastMessage,
            setUnreadMessagesById),
        [selectedConversationId, appendMessageToConversation, updateLastMessage, setUnreadMessagesById]);

    const handleIncomingMessageReadCallback = useCallback((conversationId: number) =>
        handleIncomingMessageRead(conversationId,
            setMessagesForConversation,
            messagesByConversation),
        [setMessagesForConversation, messagesByConversation]);

    useEffect(() => {
        api.user.getLocalUserProfile().then((userResponse) => {
            console.log("User profile response:", userResponse);
            setLocalUser(userResponse);

            setAuthToken(api.auth.authToken);
        }).catch((error) => {
            console.error("Error fetching user profile:", error);
            setErr(error);
        }).finally(() => setFetchingUserData(false));
    }, []);

    useEffect(() => {
        if (!authToken) {
            socket.disconnect();
            return;
        }

        if (!socket.connected) {
            socket.connect();
        }

        const handleConnect = () => {
            console.log("Socket connected:", socket.id);

            // Register
            socket.emit("register", authToken);
        };

        const handleRegister = (data: any) => {
            console.log("Registered:", data);
        };

        const handleError = (data: any) => {
            setErr(data?.message || "Unknown socket error");
        };

        socket.on("connect", handleConnect);
        socket.on("registered", handleRegister);
        socket.on("error", handleError);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("registered", handleRegister);
            socket.off("error", handleError);
            socket.disconnect();
        };
    }, [authToken]);

    // Connect to socket lma nlogin
    useEffect(() => {
        const handleMessage = (data: any) => {
            console.log("Received message:", data);
            handleIncomingMessageCallback(data);
        };

        const handleMessageRead = (data: any) => {
            handleIncomingMessageReadCallback(data.conversationId);
        };

        socket.on("message:receive", handleMessage);
        socket.on("message:read", handleMessageRead);

        return () => {
            socket.off("message:receive", handleMessage);
            socket.off("message:read", handleMessageRead);
        };
    }, [handleIncomingMessageCallback, handleIncomingMessageReadCallback]);

    if (err) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Typography variant="h6" color="error">
                    {err}
                </Typography>
            </Box>
        );
    }

    if (fetchingUserData) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Typography variant="h6">Fetching user data...</Typography>
            </Box>
        );
    }

    return (
        <>
            {children}
        </>
    );
};
