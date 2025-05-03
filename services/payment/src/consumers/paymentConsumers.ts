import { GetUserUsageMessaging, GetUserUsageConnections, GetUserUsageJobApplications, UserCreatedPayload, AuthUserDeletedPayload } from  "@shared/rabbitMQ";
import { getUsageByUserId, insertUsage, updateUsage } from "../services/usageService";
import { deleteSubscription, enableOwnedFeaturesCoveredBySubscription, getSubscriptionPlanLimits, getSubscriptionsByUser } from "../services/subscriptionPaymentService";
import { stripe } from "../controllers/paymentController";

export const handleGetUserMessagingUsage = async (payload : GetUserUsageMessaging.Request) : Promise<GetUserUsageMessaging.Response | null> => {
    const user_id = payload.user_id;
    if(!user_id){
        return null;
    }

    const user_usage = await getUsageByUserId(user_id);
    if(!user_usage){
        return null;
    }

    const current_date = new Date();
    const day_milliseconds = 24*60*60*1000;
    const difference = current_date.getTime() - user_usage.last_date.getTime();
    if(difference >= day_milliseconds){
        await updateUsage(user_id, {messages_per_day : 0, last_date : new Date()});
    }

    const response : GetUserUsageMessaging.Response = {
        messages_per_day : user_usage.messages_per_day,
        messages_per_day_limit : user_usage.messages_per_day_limit
    };


    if(payload.update_usage){
        if(user_usage.messages_per_day_limit === -1 || user_usage.messages_per_day < user_usage.messages_per_day_limit){
            await updateUsage(user_id, {messages_per_day : user_usage.messages_per_day + 1});
        }
    }

    return response;
};

export const handleGetUserConnectionsUsage = async (payload : GetUserUsageConnections.Request) : Promise<GetUserUsageConnections.Response | null> => {
    const user_id = payload.user_id;
    if(!user_id){
        return null;
    }

    const user_usage = await getUsageByUserId(user_id);
    if(!user_usage){
        return null;
    }

    const response : GetUserUsageConnections.Response = {
        connections : user_usage.connections,
        connections_limit : user_usage.connections_limit
    };

    if(payload.update_usage){
        if(user_usage.connections_limit === -1 || user_usage.connections < user_usage.connections_limit){
            await updateUsage(user_id, {connections : user_usage.connections + 1});
        }
    }
    return response;
};

export const handleGetUserJobApplicationsUsage = async (payload : GetUserUsageJobApplications.Request) : Promise<GetUserUsageJobApplications.Response | null> => {
    const user_id = payload.user_id;
    if(!user_id){
        return null;
    }

    const user_usage = await getUsageByUserId(user_id);
    if(!user_usage){
        return null;
    }

    const response : GetUserUsageJobApplications.Response = {
        job_applications_limit : user_usage.job_applications_limit,
        job_applications_per_month : user_usage.job_applications_per_month
    };

    if(payload.update_usage){
        if(user_usage.job_applications_limit === -1 || user_usage.job_applications_per_month < user_usage.job_applications_limit){
            await updateUsage(user_id, {job_applications_per_month : user_usage.job_applications_per_month + 1})
        }
    }
    return response;
};

export const handleUserCreated = async (payload : UserCreatedPayload) : Promise<void> => {
    const user_id = payload.user_id;

    if(user_id){
        await insertUsage(user_id, new Date());
    }
};

export const handleUserDeleted = async (payload : AuthUserDeletedPayload) : Promise<void> => {
    const user_id = payload.user_id;

    if(user_id){
        const subscriptions = await getSubscriptionsByUser(user_id);

        for(const subscription of subscriptions){
            if(subscription){
                await stripe.subscriptions.cancel(subscription.subscription_id);
                const subscription_plan_limits = (await getSubscriptionPlanLimits()).get(subscription.subscription_plan);
                await enableOwnedFeaturesCoveredBySubscription(subscription_plan_limits, user_id);
                await deleteSubscription(subscription.subscription_id);            
            }
        }

    }
}