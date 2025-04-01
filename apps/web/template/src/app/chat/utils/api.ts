import axios from "axios";

export const markAsRead = async (conversationId: number)=>{
    try{
        const res = await axios.put(`http://localhost:3001/messages/conversations/${conversationId}/read`);
        return res.data;
    }catch (err){
        console.error("Failed to mark messages as read:",err);
        throw err; //3ashan api layer msh UI layer fa we 
        //need to bubble up the error to the parent 3ashan
        //mankamelsh ka2en mahasalsh haga
    }
}
