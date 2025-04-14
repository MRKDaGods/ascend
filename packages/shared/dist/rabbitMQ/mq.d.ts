export declare const connectRabbitMQ: () => Promise<void>;
export declare const publishEvent: (routingKey: string, message: any) => Promise<void>;
export declare const consumeEvents: (queue: string, routingKey: string, handler: (msg: any) => Promise<void>) => Promise<void>;
export declare const setupRPCServer: (queue: string, handler: (msg: any) => Promise<any>) => Promise<void>;
export declare const callRPC: <T>(queue: string, message: any, timeoutMs?: number) => Promise<T>;
export declare const closeRabbitMQ: () => Promise<void>;
