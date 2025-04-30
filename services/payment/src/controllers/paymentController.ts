import { Request, Response } from "express";
import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";
import st from "stripe";
import { body, validationResult } from "express-validator";
import { randomUUID } from "crypto";
import { changeFeatureEnabled, getFeatureLimits, getFeaturesPurchasedByUser, insertFeature } from "../services/featurePaymentService";
import { getUsageByCustomerId, getUsageByUserId, updateUsage } from "../services/usageService";
import { deleteSubscription, disableOwnedFeaturesCoveredBySubscription, enableOwnedFeaturesCoveredBySubscription, getSubscriptionById, getSubscriptionPlanLimits, getSubscriptionsByUser, insertSubscription } from "../services/subscriptionPaymentService";
import { subscribe } from "diagnostics_channel";
import { Feature } from "@shared/models/feature";
import { Subscription } from "@shared/models/subscription";
import { Usage } from "@shared/models/usage";
import { insertSurvey } from "../services/surveyService";
import { getUserProfile } from "@shared/utils/userProfile";

if(!process.env.STRIPE_SECRET_KEY){
    throw new Error("paymentController : STRIPE_SECRET_KEY not defined");
}else if(!process.env.SESSION_TOKEN_EXPIRY_MS){
    throw new Error("paymentController : SESSION_TOKEN_EXPIRY_MS not defined");
}else if(!process.env.SESSION_TOKEN_EXPIRY_CHECK_INTERVAL_MS){
    throw new Error("paymentController : SESSION_TOKEN_EXPIRY_CHECK_INTERVAL_MS not defined");
}else if(!process.env.PAYMENT_BASE_URL){
    throw new Error("paymentController : BASE_URL not defined");
}else if(!process.env.STRIPE_WEBHOOK_SECRET_KEY){
    throw new Error("paymentController : STRIPE_WEBHOOK_SECRET_KEY not defined");
}else if(!process.env.FRONTEND_BASE_URL){
    throw new Error("paymentController : FRONTEND_BASE_URL not defined");
}

const STRIPE_SECRET_KEY : string = process.env.STRIPE_SECRET_KEY;
const SESSION_TOKEN_EXPIRY_MS : number = parseInt(process.env.SESSION_TOKEN_EXPIRY_MS);
const SESSION_TOKEN_EXPIRY_CHECK_INTERVAL_MS : number = parseInt(process.env.SESSION_TOKEN_EXPIRY_CHECK_INTERVAL_MS);
const PAYMENT_BASE_URL : string = process.env.PAYMENT_BASE_URL;
const FRONTEND_BASE_URL : string = process.env.FRONTEND_BASE_URL;
const STRIPE_WEBHOOK_SECRET_KEY : string = process.env.STRIPE_WEBHOOK_SECRET_KEY; 

export const stripe = new st(STRIPE_SECRET_KEY);

const session_tokens = new Map<string, { customer_id : string, expires_at : number, payment_type : string, return_url : string, subscription_id : string|null, user_id : number}>();


function removeExpiredTokens(){
    for(const [token, {customer_id , expires_at}] of session_tokens.entries()){
        if(Date.now() > (expires_at + SESSION_TOKEN_EXPIRY_MS)){
            session_tokens.delete(token);
        }
    } 
}

setInterval(removeExpiredTokens, SESSION_TOKEN_EXPIRY_CHECK_INTERVAL_MS);


export const getFeatures = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }    

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()});
    }

    try {
        const features = (await stripe.products.list({expand : ["data.default_price"], active : true})).data
        .filter((feature) => {
            return (feature.default_price as st.Price).type === "one_time";
        }).map((feature) => {
            return {
                id : feature.id,
                name : feature.name,
                description : feature.description,
                currency : (feature.default_price as st.Price).currency,
                price : ((feature.default_price as st.Price).unit_amount as number) / 100,
                price_id : (feature.default_price as st.Price).id
            };
        });
    
        return res.status(200).json({
            error : null,
            data : {
                features : features
            }
        });
    }catch(e){
        console.log(`Internal error : ${e}`);
        return res.status(500).json({error : "internal error"});
    }
};

export const handleFeaturePayment = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }    

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()});
    }

    try{
        const { features, relative_return_url } = req.body;

        let feature_already_purchased = (await getFeaturesPurchasedByUser(user_id)).map((feature_payment) => {
            return feature_payment.feature_purchased;
        });
        let line_items : Array<any> = [];
        const purchased_features : Set<any> = new Set(feature_already_purchased);
        // don't repurchase already purchased features
        for (const feature of features){
            if(!purchased_features.has(feature)){
                if(!line_items.find((item) => {return item.price_id === feature.price_id;})){
                    line_items.push({price : feature.price_id, quantity : 1});
                }
            }else{
                return res.status(400).json({error : `feature ${feature} already purchased`});
            }
        }
        
        const user_usage = await getUsageByUserId(user_id);
        let customer;
        if(!(user_usage?.stripe_customer_id)){ // if no customer ID has been created yet for the user
            const user = await getUserProfile(user_id);
            customer = await stripe.customers.create({
                name :  user?.first_name + ' ' + user?.last_name , 
                email : user?.contact_info?.email
            });
            await updateUsage(user_id, {
                stripe_customer_id: customer.id,
                last_date: new Date(),
            });
        }else{
            customer = await stripe.customers.retrieve(user_usage.stripe_customer_id);
        }

        const new_session_token = randomUUID();
        
        const session = await stripe.checkout.sessions.create({
            success_url : `${PAYMENT_BASE_URL}/payments/process/complete?session_id={CHECKOUT_SESSION_ID}&session_token=${new_session_token}`,
            cancel_url : `${PAYMENT_BASE_URL}/payments/process/cancel?session_token=${new_session_token}`,
            line_items : line_items,
            customer : customer.id,
            payment_method_types : ["card"],
            mode : "payment"
        });



        session_tokens.set(new_session_token, {customer_id : customer.id, expires_at : Date.now(), payment_type : "one-time", return_url : `${FRONTEND_BASE_URL}/${relative_return_url}`, subscription_id : null, user_id : user_id});
    
        res.json({
            error : null,
            data : {
                url : session.url as string
            }
        });
    }catch(e:any){
        if(e.type === "StripeInvalidRequestError"){
            return res.status(400).json({error : "Invalid price ID"});
        }
        console.log(`Internal error : ${e}`);
        return res.status(500).json({error : "internal error"});
    }
};

export const completePayment = async (req : Request, res : Response) => {
    const { session_id , session_token} = req.query;
    const obj = session_tokens.get(session_token as string);
    const { customer_id , expires_at , payment_type, return_url, subscription_id, user_id } = obj as {
        customer_id: string;
        expires_at: number;
        payment_type: string;
        return_url: string;
        subscription_id: string | null;
        user_id: number;
    };  
    if(!obj){
        return res.redirect(`${return_url}?status=failure`);    
    }
    try{
        if(!session_id){
            return res.status(403).json({error : "forbidden"});
        }
        session_tokens.delete(session_token as string);
        const session = await stripe.checkout.sessions.retrieve(session_id as string);
        const line_items = (await stripe.checkout.sessions.listLineItems(session_id as string, {
            expand: ['data.price.product', 'data.price'] // expand at listLineItems, not session.retrieve
        })).data.map((item) => {
            return {
                name: (item.price?.product as st.Product).name,
                price: ((item.price?.unit_amount as number) / 100),
                currency: (item.price?.currency)
            };
        });
        if(payment_type === "one-time"){
            // updpate the user's usage limits
            const usage_limits = await getFeatureLimits();
            let new_limits : any = {};
            for(const line_item of line_items){
                const {usage_field_affected, limit} = usage_limits.get(line_item.name);
                new_limits[usage_field_affected] = limit;
                await insertFeature(user_id, session_id as string, line_item.name, new Date(), line_item.price, line_item.currency as string, true);
            }
            await updateUsage(user_id, {
                last_date: new Date(),
                ...new_limits, // overrides specific fields if present
            })
        }else{
            const usage_limits = await getSubscriptionPlanLimits();
            const subscriptionId = session.subscription as string;
            const subscription_plan_limits = usage_limits.get(line_items[0].name);
            await updateUsage(user_id, {
                last_date: new Date(),
                ...subscription_plan_limits, // overrides specific fields if present
            })
            await insertSubscription(user_id, session_id as string, subscriptionId, line_items[0].name, new Date(), line_items[0].price, line_items[0].currency as string);
            await disableOwnedFeaturesCoveredBySubscription(subscription_plan_limits, user_id);
        }


        return res.redirect(`${return_url}?status=success`);
    }catch(e : any){
        console.log(`Internal error ${e}`);
        return res.redirect(`${return_url}?status=failure`);
    }
};

export const cancelPayment = async (req : Request, res : Response) => {
    const { session_token } = req.query;
    const obj = session_tokens.get(session_token as string);
    if(!obj){
        return res.status(403).json({error : "forbidden"});    
    }
    const { customer_id , expires_at , payment_type, return_url, subscription_id, user_id } = obj;
    session_tokens.delete(session_token as string);
    return res.redirect(`${return_url}?status=failure`);
};


export const getSubscriptionPlans = async (req : AuthenticatedRequest , res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }    

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()});
    }
    
    try {
        const subscription_plans = (await stripe.products.list({expand : ["data.default_price"], active : true})).data
        .filter((plan) => {
            return (plan.default_price as st.Price).type === "recurring"
        })
        .map((plan) => {
            return {
                id : plan.id,
                name : plan.name,
                description : plan.description,
                currency : (plan.default_price as st.Price).currency,
                price : ((plan.default_price as st.Price).unit_amount as number) / 100,
                price_id : (plan.default_price as st.Price).id
            };
        });

        return res.status(200).json({error : null , data : {
            subscription_plans : subscription_plans
        }});
    }catch(err){
        console.log(`Internal error ${err}`);
        return res.status(500).json({error : "internal error"});
    }
};

export const handleSubscriptionPayment = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }    

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()});
    }
    
    try {
        const user_usage = await getUsageByUserId(user_id);
        let customer;
        if(!(user_usage?.stripe_customer_id)){ // if no customer ID has been created yet for the user
            const user = await getUserProfile(user_id);
            customer = await stripe.customers.create({
                name :  user?.first_name + ' ' + user?.last_name , 
                email : user?.contact_info?.email
            });
            await updateUsage(user_id, {
                stripe_customer_id: customer.id,
                last_date: new Date()
            })
        }else{
            customer = await stripe.customers.retrieve(user_usage.stripe_customer_id);
        }
    
        const new_session_token = randomUUID();

        const { subscription_price_id, relative_return_url } = req.body; 

        const subscription_plan : any = (await stripe.products.list({expand : ["data.default_price"], active : true})).data.find((plan : any) => {return (plan.default_price as st.Price).id === subscription_price_id;})
        const user_subscriptions = await getSubscriptionsByUser(user_id);
        for(const subscription of user_subscriptions){
            if(subscription.subscription_plan === subscription_plan.name){
                return res.status(400).json({error : "already subscribed in this plan"});
            }
        }
        const session = await stripe.checkout.sessions.create({
            success_url : `${PAYMENT_BASE_URL}/payments/process/complete?session_id={CHECKOUT_SESSION_ID}&session_token=${new_session_token}`,
            cancel_url : `${PAYMENT_BASE_URL}/payments/process/cancel&session_token=${new_session_token}`,
            line_items :[ {
                    price : subscription_price_id,
                    quantity : 1
                }
            ],
            customer : customer.id,
            payment_method_types : ["card"],
            mode : "subscription"
        });

        session_tokens.set(new_session_token, {customer_id : customer.id, expires_at : Date.now(), payment_type : "subscription", return_url : `${FRONTEND_BASE_URL}/${relative_return_url}`, subscription_id : subscription_price_id, user_id : user_id});
        res.json({
            error : null,
            data : {
                url : session.url as string
            }
        });
    }catch(e : any){
        if(e.type === "StripeInvalidRequestError"){
            return res.status(400).json({error : "Invalid price ID"});
        }
        console.log(`Internal error : ${e}`);
        return res.status(500).json({error : "internal error"});
    }
};

export const cancelSubscription = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }    

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()});
    }
    
    try{
        const  subscription_id  = req.params["subscriptionId"];

        const subscription = await getSubscriptionById(subscription_id);
        if(!subscription){
            return res.status(404).json({error : "not found"});
        }

        if(subscription.user_id !== user_id){
            return res.status(403).json({error : "forbidden"});
        }

        try{
            await stripe.subscriptions.cancel(subscription_id);
            const subscription_plan_limits = (await getSubscriptionPlanLimits()).get(subscription.subscription_plan);
            await enableOwnedFeaturesCoveredBySubscription(subscription_plan_limits, user_id);
            await deleteSubscription(subscription_id);
            return res.status(200).json({message : "subscription cancelled successfully", error : null});
        }catch(e : any){
            return res.status(400).json({error : `failed to cancel subscription : ${e.message}`})
        }
    }catch(e){
        console.log(`Internal error : ${e}`);
        return res.status(500).json({error : "internal error"});
    }
};

export const getFeaturesOwnedByUser = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }    

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()});
    }
    
    try{
        const user_features = (await getFeaturesPurchasedByUser(user_id)).map((feature : Feature) => {
            return {
                feature_purchased : feature.feature_purchased,
                payment_date : feature.payment_date,
                amount_paid : feature.amount_paid,
                currency : feature.currency,
                enabled : feature.enabled
            };
        })

        return res.status(200).json({error : null, data : {
            features : user_features
        }});
    }catch(e){
        console.log(`Internal error : ${e}`);
        return res.status(500).json({error : "internal error"});
    }
};

export const getUserSubscriptions = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }    

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()});
    }
    
    try{
        const user_subscriptions = (await getSubscriptionsByUser(user_id)).map((subscription : Subscription) => {
            return {
                subscription_id : subscription.subscription_id,
                subscription_plan : subscription.subscription_plan,
                first_payment_data : subscription.first_payment_date,
                amount_paid : subscription.amount_paid,
                currency : subscription.currency
            };
        })

        return res.status(200).json({error : null, data : {
            subscriptions : user_subscriptions
        }});
    }catch(e){
        console.log(`Internal error : ${e}`);
        return res.status(500).json({error : "internal error"});
    }
};

export const getUserUsageLimits = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }    

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()});
    }

    try{
        let user_usage_limits = await getUsageByUserId(user_id);
        if(!user_usage_limits){
            return res.status(404).json({error : "usage limits not found"});
        }
        return res.status(200).json({
            error : null,
            data : {
                usage_limits : {
                    messages_per_day : user_usage_limits.messages_per_day,
                    connections : user_usage_limits.connections,
                    job_application_per_month : user_usage_limits.job_applications_per_month,
                    messages_per_day_limit : user_usage_limits.messages_per_day_limit,
                    conenctions_limit : user_usage_limits.conenctions_limit,
                    job_applications_limit : user_usage_limits.job_applications_limit,
                    last_date : user_usage_limits.last_date,
                } 
            }
        })
    }catch(e){
        console.log(`Internal error : ${e}`);
        return res.status(500).json({error : "internal error"});
    }
}


export const stripeWebhookHandler = async (req : Request , res : Response) => {
    let event = req.body;
    if (STRIPE_WEBHOOK_SECRET_KEY) {
      const signature : string = req.headers['stripe-signature'] as string;
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          STRIPE_WEBHOOK_SECRET_KEY
        );
      } catch (err : any) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.sendStatus(400);
      }
    }
  
    // Handle the event
    switch (event.type) {
      case 'customer.subscription.deleted':
        const cancelled_subscription_id = (event.data.object as st.Subscription).id;
        const subcription = await getSubscriptionById(cancelled_subscription_id);
        if(subcription){
            const subscription_plan_limits = (await getFeatureLimits()).get(subcription.subscription_plan);
            await enableOwnedFeaturesCoveredBySubscription(subscription_plan_limits, subcription.user_id);
            await deleteSubscription(subcription.subscription_id); 
        }
        break;
      case 'invoice.payment_succeeded':
        const invoice = event.data.object as st.Invoice;
        const subscription_id = invoice.subscription as string;
        const customer_id = invoice.customer as string;
        const user_id = (await getUsageByCustomerId(customer_id))?.user_id;
        const subscription = await getSubscriptionById(subscription_id);
        if(subscription && user_id){
            const subscription_plan_limits = (await getFeatureLimits()).get(subscription.subscription_plan);
            await updateUsage(user_id, {
                stripe_customer_id: customer_id,
                last_date: new Date(),
                ...subscription_plan_limits
            });
        }
        break;
    case 'customer.deleted' :
        const customer = event.data.object as st.Customer;
        const customerId = customer.id;

        const userId = (await getUsageByCustomerId(customerId))?.user_id;

        if(userId){
            await updateUsage(userId, {stripe_customer_id : ""});
        }
    default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    };
  
    // Return a 200 response to acknowledge receipt of the event
    res.send();
  };

export const insertSurveyResponse = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }    

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()});
    }

    try{
        const { question, answers, user_choice } = req.body;
        if(user_choice > answers.length){
            return res.status(400).json({
                error : "'user_choice' doesn't map to any answer"
            });
        }
        const survey = await insertSurvey(user_id, question, answers, user_choice, new Date());
        if(survey){
            return res.status(200).json({
                data : {
                    msg : "Response received"
                },
                error : null
            })
        }else{
            return res.status(500).json({error : "internal error"});
        }
    }catch(e){
        console.log(`Internal error : ${e}`);
        return res.status(500).json({error : "internal error"});
    } 
};