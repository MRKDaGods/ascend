import { response, Response } from "express";
import { AuthenticatedRequest } from "@shared/middleware/authMiddleware";
import st from "stripe";
import { validationResult } from "express-validator";
import { randomUUID } from "crypto";
import { checkIfFeaturePurchasedByUser, insertFeaturePayment } from "../services/featurePaymentService";

if(!process.env.STRIPE_SECRET_KEY){
    throw new Error("paymentController : STRIPE_SECRET_KEY not defined");
}else if(!process.env.SESSION_TOKEN_EXPIRY_MS){
    throw new Error("paymentController : SESSION_TOKEN_EXPIRY_MS not defined");
}else if(!process.env.SESSION_TOKEN_EXPIRY_CHECK_INTERVAL_MS){
    throw new Error("paymentController : SESSION_TOKEN_EXPIRY_CHECK_INTERVAL_MS not defined");
}

const STRIPE_SECRET_KEY : string = process.env.STRIPE_SECRET_KEY;
const SESSION_TOKEN_EXPIRY_MS : number = parseInt(process.env.SESSION_TOKEN_EXPIRY_MS);
const SESSION_TOKEN_EXPIRY_CHECK_INTERVAL_MS : number = parseInt(process.env.SESSION_TOKEN_EXPIRY_CHECK_INTERVAL_MS);

const stripe = new st(STRIPE_SECRET_KEY);

const session_token_to_currency = new Map<string, { currency : string, expires_at : number}>();


function removeExpiredTokens(){
    for(const [token, {currency , expires_at}] of session_token_to_currency.entries()){
        if(Date.now() > (expires_at + SESSION_TOKEN_EXPIRY_MS)){
            session_token_to_currency.delete(token);
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
        const { currency } = req.body;

        const new_session_token = randomUUID();
    
        session_token_to_currency.set(new_session_token, {currency : currency, expires_at : Date.now()});
    
        const features = (await stripe.products.list({expand : ["data.default_price"]})).data.map((feature) => {
            return {
                id : feature.id,
                active : feature.active,
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
                features : features,
                session_token : new_session_token
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
        const { session_token, price_id, feature } = req.body;
        
        if(!session_token_to_currency.get(session_token)){
            return res.status(400).json({error : "Invalid toekn"});
        }

        const feature_already_purchased = await checkIfFeaturePurchasedByUser(user_id, feature);
        if(feature_already_purchased){
            return res.status(400).json({error : "feature already purchased"});
        } 
        const session = await stripe.checkout.sessions.create({
            success_url : "http://localhost:3011/complete?session_id={CHECKOUT_SESSION_ID}",
            cancel_url : "http://localhost:3011/cancel",
            line_items : [
                {
                    price : price_id,
                    quantity : 1,
                    price_data : {
                        currency : session_token_to_currency.get(session_token)?.currency as string,
                        product_data : {
                            name : feature
                        }
                    }
                }
            ],
            mode : "payment"
        });

        res.json({session_token : session_token }).redirect(session.url as string)
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
        const { session_token } = req.body;
        const session_id : string = req.query.session_id as string;
        if(!session_id){
            return res.status(403).json({error : "forbidden"});
        }
        const session = await stripe.checkout.sessions.retrieve(session_id);
        const line_items = await stripe.checkout.sessions.listLineItems(session_id, {expand : [""]});
        //await insertFeaturePayment(user_id, session_id, session.line_items.p)
    }catch(e : any){
        if(e.statusCode === 404){ // which is returned by stripe.checkout.sessions.retrieve function when the session is not found
            return res.status(403).json({error : "forbidden"});
        }
        console.log(`Internal error ${e}`);
        return res.status(500).json({error : "internal error"});
    }
}