import { response, Response } from "express";
import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";
import st from "stripe";
import { validationResult } from "express-validator";
import { randomUUID } from "crypto";
import { getFeatureLimits, getFeaturePaymentsByUser, insertFeaturePayment } from "../services/featurePaymentService";
import { getUsageByUserId, updateUsage } from "../services/usageService";

if(!process.env.STRIPE_SECRET_KEY){
    throw new Error("paymentController : STRIPE_SECRET_KEY not defined");
}else if(!process.env.SESSION_TOKEN_EXPIRY_MS){
    throw new Error("paymentController : SESSION_TOKEN_EXPIRY_MS not defined");
}else if(!process.env.SESSION_TOKEN_EXPIRY_CHECK_INTERVAL_MS){
    throw new Error("paymentController : SESSION_TOKEN_EXPIRY_CHECK_INTERVAL_MS not defined");
}else if(!process.env.BASE_URL){
    throw new Error("paymentController : BASE_URL not defined");
}

const STRIPE_SECRET_KEY : string = process.env.STRIPE_SECRET_KEY;
const SESSION_TOKEN_EXPIRY_MS : number = parseInt(process.env.SESSION_TOKEN_EXPIRY_MS);
const SESSION_TOKEN_EXPIRY_CHECK_INTERVAL_MS : number = parseInt(process.env.SESSION_TOKEN_EXPIRY_CHECK_INTERVAL_MS);
const BASE_URL : string = process.env.BASE_URL

const stripe = new st(STRIPE_SECRET_KEY);

const session_tokens = new Map<string, { customer_id : string, expires_at : number}>();


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
        const { features } = req.body;

        let feature_already_purchased;
        let line_items : Array<any> = []
        const purchased_features : Set<any> = new Set((await getFeaturePaymentsByUser(user_id)).map((feature_payment) => {
            return feature_payment.feature_purchased;
        }));
        for (const feature of features){
            if(!purchased_features.has(feature)){
                line_items.push({price : feature.price_id, quantity : 1});
            }
        }
        
        const user_usage = await getUsageByUserId(user_id);
        let customer;
        if(!(user_usage?.stripe_customer_id)){ // if no customer ID has been created yet for the user
            // const user = ?? // retrieve from user profile service
            customer = await stripe.customers.create({
                name :  "",
                email : ""
            });
            await updateUsage({user_id : user_id, stripe_customer_id : customer.id});
        }else{
            customer = await stripe.customers.retrieve(user_usage.stripe_customer_id);
        }

        const new_session_token = randomUUID();
    
        session_tokens.set(new_session_token, {customer_id : customer.id, expires_at : Date.now()});
    
        
        const session = await stripe.checkout.sessions.create({
            success_url : `${BASE_URL}/payments/process/complete?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url : `${BASE_URL}/payments/process/cancel`,
            line_items : line_items,
            customer : customer.id,
            payment_method_types : ["card"],
            mode : "payment"
        });

        res.json({session_token : new_session_token, customer : customer}).redirect(session.url as string);
    }catch(e){
        console.log(`Internal error : ${e}`);
        return res.status(500).json({error : "internal error"});
    }
};

export const completeFeaturePayment = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }    

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()});
    }
    
    try{
        const { session_token, customer } = req.body;
        const session_id : string = req.query.session_id as string;
        if(!session_id || session_tokens.get(session_token)?.customer_id !== customer.id ){
            return res.status(403).json({error : "forbidden"});
        }
        session_tokens.delete(session_token);
        const session = await stripe.checkout.sessions.retrieve(session_id, {expand : ["line_items.data.price.product", "line_items.data.price.product.default_price"]});
        const line_items = (await stripe.checkout.sessions.listLineItems(session_id)).data.map((item) => {
            return {
                name : (item.price?.product as st.Product).name,
                price : (((item.price?.product as st.Product).default_price as st.Price).unit_amount as number) / 1000,
                currency : ((item.price?.product as st.Product).default_price as st.Price).currency
            }
        });

        // updpate the user's usage limits
        const usage_limits = await getFeatureLimits();
        for(const line_item of line_items){
            const {usage_field_affected, limit} = usage_limits.get(line_item.name);
            await updateUsage({user_id : user_id, [usage_field_affected] : limit});
        }
        return res.status(200).json({purchased : line_items});
    }catch(e : any){
        if(e.statusCode === 404){ // which is returned by stripe.checkout.sessions.retrieve function when the session is not found
            return res.status(403).json({error : "forbidden"});
        }
        console.log(`Internal error ${e}`);
        return res.status(500).json({error : "internal error"});
    }
}

export const cancelFeaturePayment = async (req : AuthenticatedRequest, res : Response) => {
    const user_id = req.user?.id;
    if(!user_id){
        return res.status(401).json({error : "unauthorized"});
    }    

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()});
    }

    const {session_token} = req.body;
    session_tokens.delete(session_token);
    return res.status(402).json({error : "payment failed"});
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
            // const user = ?? // retrieve from user profile service
            customer = await stripe.customers.create({
                name :  "",
                email : ""
            });
            await updateUsage({user_id : user_id, stripe_customer_id : customer.id});
        }else{
            customer = await stripe.customers.retrieve(user_usage.stripe_customer_id);
        }
    
        const new_session_token = randomUUID();
    
        session_tokens.set(new_session_token, {customer_id : customer.id, expires_at : Date.now()});
    }catch(e){
        
    }
}