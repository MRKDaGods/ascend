"use client";
import { Box,Typography,Button,Avatar,IconButton} from "@mui/material";
import { useEffect,useRef, useState} from "react";
import { useChatStore } from "../store/chatStore";
import axios from "axios";
import Message from "./Message";
import InputBox from "./InputBox";
import { handleIncomingMessage } from "../utils/fireBaseHandlers";
import { Socket } from "dgram";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { conversation } from "./Sidebar";
//import { socket } from "../utils/socket";


export default function ChatWindow(){

    //FOR THE Block MENU
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuConvId, setMenuConvId] = useState<number | null>(null);
    //worse readablioty compared to destructuring bas ahsan in avoiding unnecessary rerendering of store
    const selectedConversationId = useChatStore(state => state.selectedConversationId);
    const setMessagesForConversation = useChatStore(state => state.setMessagesForConversation);
    const conversations = useChatStore((state) => state.conversations);
    const { setSelectedConversationId, setConversations } = useChatStore.getState();

    const allMessages = useChatStore(state => state.messagesByConversation);

    const messagesByConversation = selectedConversationId ? allMessages[selectedConversationId] || [] : [];

    const resetPage = useChatStore(state => state.resetPage);
    const page= useChatStore(state=>state.page);
    const setpage = useChatStore(state=>state.setPage);

    //initialize bottom ref for scroll to bottom
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [shouldScrollToBottom,setShouldScrollToBottom]=useState(true);

    // TEMPORARYY TO CHECK IF SOMEONE BLOCKED ME
    
      
              useEffect(() => {
                const interval = setInterval(async () => {
                  try {
                    const res = await axios.get("http://localhost:3001/conversations");
                    
                    const updatedConversations = res.data; // this has isBlockedByPartner
              
                    const blockedUserIds: string[] = [];
              
                    //  Update conversations
                    const updatedConvos = updatedConversations.map((updated:conversation) => {
                      if (updated.isBlockedByPartner) {
                        blockedUserIds.push(updated.userId); // collect the blocked user's ID
                        return {
                          ...updated,
                          name: "LinkedIn User",
                          avatar: "",
                        };
                      }
                      return updated;
                    });
              
                    // Set conversations
                    useChatStore.getState().setConversations(updatedConvos);

                  } catch (e) {
                    console.error("Polling for block updates failed:", e);
                  }
                }, 10000); // every 10s
              
                return () => clearInterval(interval);
              }, []);
              

      //PERMANENT check for blocks (NOT FINAL COULD NEED UPDATES)
    //   useEffect(() => {
    //     socket.on("conversation-updated", (updatedConvo) => {
    //       const { conversations, messagesByConversation, setConversations, setMessagesForConversation } =
    //         useChatStore.getState();
      
    //       // Step 1: Update the conversation (sidebar)
    //       const newConversations = conversations.map((conv) => {
    //         if (conv.id === updatedConvo.id) {
    //           if (updatedConvo.isBlockedByPartner) {
    //             return {
    //               ...conv,
    //               name: "LinkedIn User",
    //               avatar: "",
    //               isBlockedByPartner: true,
    //             };
    //           }
    //           return { ...conv, ...updatedConvo };
    //         }
    //         return conv;
    //       });
      
    //       setConversations(newConversations);
      
    //     return () => {
    //       socket.off("conversation-updated");
    //     };
    //   }, []);
      

   
    //To get the conversations most recent medssages
    useEffect(()=>{
        if (!selectedConversationId) return;
        
        //clear old pagination
        resetPage();
        setShouldScrollToBottom(true);

        //comment this out when testing the triggering a test msg button
        axios.get(`http://localhost:3001/messages/${selectedConversationId}?limit=20&page=1`)
        .then((response)=>{
            setMessagesForConversation(selectedConversationId!,response.data.data.messages);
        })
        .catch((e)=>{
            console.error("failed to fetch messages:",e);
        });
    },[selectedConversationId]);

    //scroll to bottom
    useEffect(() => {
        if (!shouldScrollToBottom || !bottomRef.current) return;
      
        requestAnimationFrame(() => {
          bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        });
      }, [messagesByConversation.length]);
      

    //get older messages
    const loadOlderMessages = ()=>{
        const nextPage=page+1;
        axios
        .get(`http://localhost:3001/messages/${selectedConversationId}?limit=20&page=${nextPage}`)
        .then((res)=>{
            const newMessages = res.data?.data?.messages || [];
            const existingMessages = messagesByConversation;

            //check for duplicate messages
            if (
              !Array.isArray(newMessages) ||
              newMessages.length === 0 ||
              newMessages.every((msg: any) => existingMessages.some((m) => m.id === msg.id))
            ) {
              console.log("no more messages to load");
              return;
            } 
            
            //else prepend older msgs to the top
            setShouldScrollToBottom(false);
            setMessagesForConversation(selectedConversationId!,(prev)=>
                [...newMessages,...prev]);
            setpage(nextPage);
        })
        .catch((e)=>console.error("Failed to load older messages:", e));
    };
     

    //listen for typing event
    const typingStatus = useChatStore(state=>state.typingStatus[selectedConversationId!] || false);
    const setTypingStatus = useChatStore(state=>state.setTypingStatus);
    

    //useRef so it persists across rerenders of chat window
    const typingTimers=useRef<{[conversationId:number]: NodeJS.Timeout}>({});

    //temporarily until we implement sockets:
     const handleTyping = (conversationId:number)=>{
        setTypingStatus(conversationId,true);

        //clear any existing timer
        if (typingTimers.current[conversationId]){
            clearTimeout(typingTimers.current[conversationId]);
        }

        //set a new timer to mark as not typing after 3 sec of no typing
        typingTimers.current[conversationId]=setTimeout(()=>{
            setTypingStatus(conversationId,false);
            delete typingTimers.current[conversationId];
        },3000);
    }

    // after implementing SOCKETS UNCOMMENT
    // Socket.on("typing",({conversationId})=>{
    //     setTypingStatus(conversationId,true);

    //     //clear any existing timer
    //     if (typingTimers[conversationId]){
    //         clearTimeout(typingTimers[conversationId]);
    //     }

    //     //set a new timer
    //     typingTimers[conversationId]=setTimeout(()=>{
    //         setTypingStatus(conversationId,false);
    //         delete typingTimers[conversationId];
    //     },3000);
    // });


    if (!selectedConversationId){
        {
            return(
                <Box sx={{flexGrow: 1, display: "flex", alignItems:"center", justifyContent:"center" }}>
                    <Typography variant="h6" sx={{color:"#495057" }}>
                        select conversation to start chatting
                    </Typography>
             </Box>
            );
            
        }
    }

    //finding partner name
    const conversation = conversations.find((c) => c.id === selectedConversationId);
    const partnerName = conversation?.name || "Chat";
    const isBlocked = conversation?.isBlockedByPartner;


    const handleBlock = async () => {
        try {
          if (!conversation?.userId) {
            console.warn("No userId found to block.");
            return;
          }
      
          await axios.post("http://localhost:3001/messages/block", {
            userId: conversation.userId,
          });
      
          setConversations(conversations.filter((c) => c.id !== selectedConversationId));
          setSelectedConversationId(null);
        } catch (e) {
          console.error("Failed to block user", e);
        }
      };
      
      
    

    const open = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
      setAnchorEl(event.currentTarget);
      setMenuConvId(id);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
      setMenuConvId(null);
    };



   
   return(
    <>
    <Box sx={{display:"flex", flexDirection:"column",height:"100%",minHeight:0,paddingTop:"62px"}}>
    <Box
  sx={{
    display: "flex",
    justifyContent: "space-between", // pushes name left and icon right
    alignItems: "flex-start",
    height: "100px",
    borderBottom: "2px solid #ccc",
    pl: 2,
    pr: 2,
    pt: 1,
  }}
>
  {/* Left side: name + typing status */}
  <Box sx={{ display: "flex", flexDirection: "column" }}>
    <Typography
      variant="subtitle1"
      fontWeight="bold"
      sx={{ mb: "2px", lineHeight: 1.1 }}
    >
      {partnerName}
    </Typography>

    {typingStatus && (
      <Typography variant="caption" color="gray" sx={{ mt: "2px", lineHeight: 1 }}>
        typing...
      </Typography>
    )}
  </Box>

  {/* Right side: menu icon */}
  <IconButton edge="end" onClick={(e) => handleMenuClick(e, selectedConversationId)}>
    <MoreVertIcon />
  </IconButton>
</Box>

{/* chat window header (avatar w keda) */}
    <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 1 }}>
    <Box sx={{
        borderBottom:"1px solid #ccc", 
        width:"100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 2,
        paddingX: 2, 
        paddingY: 1

        }}>
        <Avatar
            src={conversation?.avatar}
            alt={conversation?.name}
            sx={{ width: 95, height: 95 }}
        />
       <Typography variant="subtitle1" fontWeight="bold" >
            {partnerName}
        </Typography>
    </Box>
    
  {/* button to load older msgs */}
    <Button variant="outlined" onClick={loadOlderMessages} size="small" sx={{mb: 2}}>
        Load older messages
    </Button>

    {/* TYPING TESTER BUTTON */}
    <Button sx={{mb: 2}} onClick={() => {
        handleTyping(selectedConversationId);
 }}>
   Trigger Typing Test
 </Button> 
{/* END OF TYPING TESTER BUTTON */}


{/* render msgs iin chat window */}
    {messagesByConversation.map((msg) => (
     <Message key={msg.id} 
     id={msg.id} 
     content={msg.content} 
     sender={msg.sender} 
     mediaUrls={msg.mediaUrls} 
     createdAt={msg.createdAt} 
     conversationId={msg.conversationId}
     recipient={msg.recipient}
     status={msg.status}
     />
    ))}
    <Box ref={bottomRef} id="chat-bottom"/>
    
    
  </Box>
  {!isBlocked ? <InputBox /> : (
  <Box sx={{ padding: 2, textAlign: "center", color: "gray" }}>
    <Typography variant="body2" fontStyle="italic">
      You can no longer message this user.
    </Typography>
  </Box>
)}

  
  </Box>

  {/* block menu */}
  <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
  {menuConvId !== null && (
    <MenuItem
      onClick={() => {
        handleBlock();
        handleMenuClose();
      }}
    >
      Block
    </MenuItem>
  )}
</Menu>

  </>
   );
   
   
}

