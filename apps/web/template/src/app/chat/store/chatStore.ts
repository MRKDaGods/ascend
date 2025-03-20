import {create} from "zustand";
import { conversation } from "../components/Sidebar";

//should include all global states related to chat

//defining the whole state (el state 3ala baadaha gowaha selectedid w conversations)
type chatStore ={
    selectedConversationId: number | null;
    setSelectedConversationId: (id: number | null) => void;
    conversations: conversation[],
    setConversations: (convos: conversation[])=>void;

}

//actual store el lama ba call useChateStore byraga3ly the state object passed to set 
export const useChatStore = create<chatStore>((set)=>({
    selectedConversationId: null,
    setSelectedConversationId: (id)=>set({selectedConversationId: id}),
    conversations:[],
    setConversations: (convos)=>set({conversations: convos})

}));

