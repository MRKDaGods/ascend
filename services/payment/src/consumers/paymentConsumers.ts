import { GetUserUsage } from  "@shared/rabbitMQ";
import { getUsageByUserId } from "../services/usageService";

export const handleGetUserUsage = async (payload : GetUserUsage.Request) : Promise<GetUserUsage.Response | null> => {
    const user_id = payload.user_id;
    if(!user_id){
        return null;
    }

    const user_usage = await getUsageByUserId(user_id);
    if(!user_usage){
        return null;
    }

    return {
        usage : user_usage
    }
};