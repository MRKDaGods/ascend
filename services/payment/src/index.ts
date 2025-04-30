import startSharedService from "@shared/sharedService";
import paymentRoutes from "./routers/paymentRouter";
import { consumeEvents, getRPCQueueName, setupRPCServer, Events, getQueueName } from "@shared/rabbitMQ";
import {  handleGetUserConnectionsUsage, handleGetUserJobApplicationsUsage, handleGetUserMessagingUsage, handleUserCreated, handleUserDeleted } from "./consumers/paymentConsumers";
import { Services } from "@ascend/shared";

startSharedService(Services.PAYMENT, paymentRoutes, {
    postMQInit : async() => {
        await setupRPCServer(getQueueName(Events.GET_USER_USAGE_MESSAGING) , handleGetUserMessagingUsage);
        await setupRPCServer(getQueueName(Events.GET_USER_USAGE_CONNECTIONS) , handleGetUserConnectionsUsage);
        await setupRPCServer(getQueueName(Events.GET_USER_USAGE_JOB_APPLICATIONS) , handleGetUserJobApplicationsUsage);
    },

    registerConsumers : [
        async () => {
            await consumeEvents(getQueueName(Events.USER_CREATED), Events.USER_CREATED, handleUserCreated);
        },

        async () => {
            await consumeEvents(getQueueName(Events.AUTH_USER_DELETED), Events.AUTH_USER_DELETED, handleUserDeleted );
        }
    ]
});