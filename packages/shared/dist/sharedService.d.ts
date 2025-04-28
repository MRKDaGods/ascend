import express, { Router } from "express";
/**
 * Starts a shared service with the given name and routes
 * and connects to RabbitMQ
 *
 * @param name - The name of the service
 * @param routes - The routes to register with the service
 * @param options - Additional options for the service
 * @param options.dontConnectRabbitMQ - If true, the service will not connect to RabbitMQ
 * @param options.registerConsumers - An array of functions to register as consumers
 * @param options.customInit - A custom initialization function for the service
 * @param options.postMQInit - A function to run after connecting to RabbitMQ
 *
 * @remarks
 * Any changes made here must be backwards compatible with the existing services
 */
declare const startSharedService: (name: string, routes?: Router, options?: {
    dontConnectRabbitMQ?: boolean;
    registerConsumers?: Array<() => Promise<void>>;
    customInit?: (app: express.Express) => Promise<void>;
    postMQInit?: () => Promise<void>;
}) => Promise<void>;
export default startSharedService;
