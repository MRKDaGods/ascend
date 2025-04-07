import {create} from "zustand";
import { conversation } from "../components/Sidebar";
import { messageProps } from "../components/Message";




//should include all global states related to chat

//defining the whole state (el state 3ala baadaha gowaha selectedid w conversations w msgs)
type chatStore ={
    selectedConversationId: number | null;
    setSelectedConversationId: (id: number | null) => void;
    conversations: conversation[];
    setConversations: (convos: conversation[] | ((prev:conversation[])=>conversation[]))=>void;
    updateLastMessage: (conversationId: number,newLastMessage:string) =>void;
    messagesByConversation: { [conversationId: number]: messageProps[]};
    setMessagesForConversation: (id: number, msgs: messageProps[] | ((prev: messageProps[])=>messageProps[]))=>void;
    appendMessageToConversation: (id: number, msg:messageProps) => void; //for convenience bas el ablaha is enough to append
    page: number;
    setPage: (newPage: number)=>void;
    resetPage: ()=>void;
    unreadMessagesById: {[conversationId: number]: number};
    setUnreadMessagesById: (id: number, unreadcount: number | ((prev: number)=>number))=>void;
    markConversationAsRead: (id:number)=>void;
    markConversationAsUnread:(id:number)=>void;
    typingStatus:{[conversationId: number]: boolean};
    setTypingStatus: (id:number, isTyping:boolean)=>void;
    
}

//actual store el lama ba call useChateStore byraga3ly the state object passed to set
//ana lama ba setWTV i update the state object bel object el b3taha l set 
export const useChatStore = create<chatStore>((set)=>({
    selectedConversationId: null,
    setSelectedConversationId: (id)=>set({selectedConversationId: id}),
    conversations:[],
    setConversations: (convosOrFn)=>
        typeof convosOrFn === "function"
        ? set((state)=> ({conversations:convosOrFn(state.conversations)}))
        : set({conversations:convosOrFn})
     ,
    updateLastMessage: (conversationId,newLastMessage)=> set((state)=>({
        conversations: state.conversations.map((conv)=> 
        conv.id===conversationId? {...conv,lastMessage:newLastMessage} : conv
    )
    })),
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
    appendMessageToConversation: (id, msg) => {
        if (id == null) return {};
        console.log("Store append to convo:", id, msg.content);
        return set((state) => ({
          messagesByConversation: {
            ...state.messagesByConversation,
            [id]: [...(state.messagesByConversation[id] || []), msg],
          },
        }))
      },
    page: 1,
    setPage: (newPage)=>set({page:newPage}),
    resetPage: ()=>set({page:1}),
    unreadMessagesById: {},
    setUnreadMessagesById: (id,newCount)=> 
        typeof newCount==="function"
    ? set((state)=>({
        unreadMessagesById: {
            ...state.unreadMessagesById,
            [id]: newCount(state.unreadMessagesById[id] || 0),
        },
    })): set((state)=>({
        unreadMessagesById: {...state.unreadMessagesById,[id]:newCount}
    })),
    markConversationAsRead: (id)=>set((state)=>({unreadMessagesById: {
        ...state.unreadMessagesById, [id]:0,}
    })),
    markConversationAsUnread: (id)=> set((state)=>({
        unreadMessagesById: {
            ...state.unreadMessagesById, [id]: 1,
        }
    })),
    typingStatus:{},
    setTypingStatus: (id,isTyping)=>
        set((state)=>({
            typingStatus: {
                ...state.typingStatus,
                [id]:isTyping,
            },
        })),


}));

