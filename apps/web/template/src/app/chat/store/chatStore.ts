import {create} from "zustand";
import { conversation } from "../components/Sidebar";


type message ={
    id: number;
    sender: string;
    content:string;
    media: null | {
        type: "image" | "video" | "document";
        url: string;
        fileName?: string;
    };
    timestamp: string;
}

//should include all global states related to chat

//defining the whole state (el state 3ala baadaha gowaha selectedid w conversations w msgs)
type chatStore ={
    selectedConversationId: number | null;
    setSelectedConversationId: (id: number | null) => void;
    conversations: conversation[],
    setConversations: (convos: conversation[])=>void;
    displayedMessages: message[];
    //momken msgs tekoon fn betakhod el previous msg array w t return a new one (updater fn)
    setDisplayedMessages: (msgs: message[] | ((prev: message[])=>message[]))=>void;
    page: number;
    setPage: (newPage: number)=>void;
    resetPage: ()=>void;
}

//actual store el lama ba call useChateStore byraga3ly the state object passed to set
//ana lama ba setWTV i update the state object bel object el b3taha l set 
export const useChatStore = create<chatStore>((set)=>({
    selectedConversationId: null,
    setSelectedConversationId: (id)=>set({selectedConversationId: id}),
    conversations:[],
    setConversations: (convos)=>set({conversations: convos}),
    displayedMessages:[],
    //akeny ba2ool take current displayedmessages, pass it to msgs fn and update it with the return value of msgs
    setDisplayedMessages: (msgs)=> 
        typeof msgs === "function"
             ? set((state)=>({displayedMessages:msgs(state.displayedMessages)})) 
             : set({displayedMessages:msgs}),
    page: 1,
    setPage: (newPage)=>set({page:newPage}),
    resetPage: ()=>set({page:1})


}));

