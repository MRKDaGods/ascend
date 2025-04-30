import {body, query, param, ValidationChain, Meta } from "express-validator";


export const featurePurchaseValidation : ValidationChain[] = [
    body("features").exists().withMessage("'features' is required").isArray().withMessage(" 'features' must be an array")
    .custom((arr : Array<any>) => { return arr.length > 0 }).withMessage("'features' can't be an empty array")
    .custom((arr) => arr.every((item : any) => {return (item?.price_id !== undefined)}))
    .withMessage('every feature must be a string'),

    body("relative_return_url").exists().withMessage("'relative_return_url' is required (with '/' at the beginning)")
    .matches(/^$|^([^\/]+)(\/[^\/]+)*$/)
    .withMessage("'relative_return_url' must be in the format: segment1/segment2/... with no empty segments")
];

export const subscriptionValidation : ValidationChain[] = [
    body("subscription_price_id").exists().withMessage("'subscription_price_id' is required")
    .notEmpty().withMessage("'subscription_price_id' can't be empty"),

    body("relative_return_url").exists().withMessage("'relative_return_url' is required (with '/' at the beginning)")
    .matches(/^$|^([^\/]+)(\/[^\/]+)*$/)
    .withMessage("'relative_return_url' must be in the format: segment1/segment2/... with no empty segments")
];

export const subscriptionCancellationValidation : ValidationChain[] = [
    param("subscriptionId").exists().withMessage("'subscriptionId'  path parameter is required")
    .notEmpty().withMessage("'subscription_id' can't be empty")
]

export const surveyResponseValidation : ValidationChain[] = [
    body("question").exists().withMessage("'question' is required")
    .notEmpty().withMessage("'question' can't be empty"),

    body("answers").exists().withMessage("'answers' is required").isArray().withMessage(" 'answers' must be an array")
    .custom((arr : Array<any>) => { arr.length > 0 }).withMessage("'answers' can't be an empty array"),
    
    body("user_choice").exists().withMessage("'user_choice' can't be empty").isInt({min : 0})
    .withMessage("'user_choice' can only be a nonnegative integer")
];