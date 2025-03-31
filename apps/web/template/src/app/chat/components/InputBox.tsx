"use client";
import { Box,TextField,IconButton,Button, Typography} from "@mui/material";
import {useState,useRef} from "react";
import { useChatStore } from "../store/chatStore";
import axios from "axios";

export default function InputBox(){
    const [messageText,setMessageText]=useState("");
    const [selectedFiles,setselectedFiles]=useState<File[]>([]);

    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    //function to upload media to firebase and recieve urls to send with post message
    const uploadMediaFiles = async (files: File[]): Promise<string[]>=>{
        const formData = new FormData();

        files.forEach((file)=>{  //append each file under the name files
            formData.append("files",file);
        })

        try{
            const res = await axios.post("http://localhost:3001/media",formData,{
                headers: {
                    "Content-Type": "multipart/form-data", //tell server this is file upload
                },
            });

            return res.data?.mediaUrls || []; //return th euploaded file urls
        }catch(error){
            console.error("Failed to upload media files:",error);
            return [];
        }

    }



    const handleSend = async ()=>{
        const {
            selectedConversationId,
            appendMessageToConversation,
        } = useChatStore.getState();

        
        try{
            //get urls for media
            let uploadedUrls: string[]=[];
            if (selectedFiles.length>0){
                uploadedUrls = await uploadMediaFiles(selectedFiles);
            }
            //send post request to send msg
            const res = await axios.post("http://localhost:3001/messages",{
                conversationId: selectedConversationId,
                content: messageText.trim(),
                mediaUrls: uploadedUrls,
            });
            const newMessage = res.data?.data?.message;

            if (newMessage && selectedConversationId!==null){
                appendMessageToConversation(selectedConversationId,newMessage);
                // Manually scroll to bottom
                const chatWindowBottom = document.getElementById("chat-bottom");
                chatWindowBottom?.scrollIntoView({ behavior: "smooth" });
            }
                //reset input
            setMessageText("");
            setselectedFiles([]);
        } catch (error){
            console.error("Failed to send message:", error)
        }
    }

    return(
        <>
        <Box sx={{display:"flex",alignItems:"center",gap:1,padding:1,borderTop:"1px solid #ccc",backgroundColor:"#fff"}}>
            <input 
            type="file" 
            multiple //to allow multiple file selection
            accept="image/*" 
            ref={imageInputRef} 
            style={{display:"none"}}
            onChange={(e)=>{
                const files = e.target.files;
                if (!files) return;
                const newFiles=Array.from(files); //convert the file list to arr
                setselectedFiles((prev)=>[...prev,...newFiles])
            }}
            />

            <input
            type="file"
            accept=".pdf,.doc,.docx,.mp4,.mov"
            ref={fileInputRef}
            style={{display: "none"}}
            onChange={(e)=>{
                 const files = e.target.files;
                if (!files) return;
                const newFiles=Array.from(files); //convert the file list to arr
                setselectedFiles((prev)=>[...prev,...newFiles])
            }}
            />
            <IconButton onClick={()=>imageInputRef.current?.click()}>
            📷
            </IconButton>

            <IconButton onClick={()=>fileInputRef.current?.click()}>
            📎
            </IconButton>

            <TextField
            placeholder="Write a message..."
            size = "small"
            value={messageText}
            onChange={(e)=>setMessageText(e.target.value)}
            />

           <Button 
           sx={{borderRadius:9}}
           variant = "contained"
            onClick={handleSend}
            disabled={!messageText.trim() && selectedFiles.length===0}
            >
                Send
           </Button>

        </Box>

        {/*remove and preview files*/}
        {selectedFiles.length>0 && (
            
            <Box sx={{display:"flex",flexWrap:"wrap",gap:2}}>
            {
                selectedFiles.map((file,index)=>{
                    const isImage = file.type.startsWith("image/");
                    return(
                        <Box
                        key={index}
                        sx={{
                            border:"1px solid #ddd",
                            width: isImage? 100 :"auto",
                            position:"relative",
                            borderRadius:2,
                            padding:1
                        }}
                        >
                        {/*remove button */}
                        <Button size ="small"
                        onClick={()=>setselectedFiles((prev)=>prev.filter((_,i)=>i!==index))}
                        sx={{
                            position:"absolute",
                            top:0,
                            right:0,
                            color:"black",
                            minWidth:"unset", //shrink naturally
                            padding: "2px 6px",
                            fontSize:15,
                            lineHeight:1
                        }}
                        >
                        X
                        </Button>

                        {/*preview */}
                            {
                                isImage? (
                                    <img 
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    style={{width:"100%",borderRadius:4}}
                                    />
                                ):
                                <Typography fontSize="0.8rem">
                                {file.name}
                                </Typography>
                            }
                        </Box>
                    );
                })
            }
            </Box>

        )
           
        }
        </>
    );
}