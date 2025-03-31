import {create} from "zustand";
import { conversation } from "../components/Sidebar";
import { messageProps } from "../components/Message";




//should include all global states related to chat

//defining the whole state (el state 3ala baadaha gowaha selectedid w conversations w msgs)
type chatStore ={
    selectedConversationId: number | null;
    setSelectedConversationId: (id: number | null) => void;
    conversations: conversation[];
    setConversations: (convos: conversation[])=>void;
    messagesByConversation: { [conversationId: number]: messageProps[]};
    setMessagesForConversation: (id: number, msgs: messageProps[] | ((prev: messageProps[])=>messageProps[]))=>void;
    appendMessageToConversation: (id: number, msg:messageProps) => void; //for convenience bas el ablaha is enough to append
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
    messagesByConversation: {},
    //set new message list or update one
    setMessagesForConversation: (id,msgs)=> typeof msgs === "function"
    ? set((state)=>({
        messagesByConversation: {
            ...state.messagesByConversation,[id]:msgs(state.messagesByConversation[id] || [])
        }
    })
    ): set((state)=>({
        messagesByConversation: {...state.messagesByConversation, [id]: msgs}
    })),
    //update a new message list
    appendMessageToConversation: (id, msg) =>
        set((state) => ({
          messagesByConversation: {
            ...state.messagesByConversation,
            [id]: [
              ...(state.messagesByConversation[id] || []),
              msg,
            ],
          },
        })),
      
   
    page: 1,
    setPage: (newPage)=>set({page:newPage}),
    resetPage: ()=>set({page:1})


}));

