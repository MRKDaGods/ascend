# Shared Backend SDK

`@ascend/shared` is the common TypeScript package used by all backend microservices. It provides database connections, authentication middleware, RabbitMQ messaging, and shared data models.

Every service declares `@ascend/shared` as a dependency and uses it to bootstrap its Express server.

## Structure

```
src/
  index.ts                  # Services enum, package exports
  sharedService.ts          # startSharedService() bootstrap function
  config/
    db.ts                   # PostgreSQL connection pool (pg.Pool)
  middleware/
    authMiddleware.ts       # JWT token validation
    emailAuthMiddleware.ts  # Email-specific auth
    validationMiddleware.ts # Express-validator integration
  models/                   # Shared TypeScript interfaces
  rabbitMQ/
    mq.ts                   # Connect, publish, consume, RPC helpers
    events.ts               # Events enum and queue naming
    payloads.ts             # Event payload type definitions
  utils/
    jwt.ts                  # JWT sign/verify helpers
    files.ts                # Presigned URL generation, file metadata
    notifs.ts               # Notification sending utility
    userProfile.ts          # Cross-service profile helpers
```

## Usage

### Service Bootstrap

Every service entry point looks like this:

```typescript
import { startSharedService } from "@ascend/shared";
import routes from "./routes";

startSharedService("auth", routes, {
  consumers: [...],
  rpcServers: [...]
});
```

`startSharedService()` creates an Express app with CORS and JSON parsing, mounts the service's routes, connects to RabbitMQ, registers consumers and RPC servers, then starts listening on `process.env.PORT`.

### RabbitMQ

Two messaging patterns:

**Pub/sub** (fire and forget):
```typescript
import { publishEvent, Events } from "@ascend/shared";
publishEvent(Events.USER_REGISTERED, { userId: "..." });
```

**RPC** (request/reply):
```typescript
import { callRPC } from "@ascend/shared";
const profile = await callRPC("user", "getProfile", { userId: "..." });
```

Events are published to a topic exchange (`system.events`). RPC uses correlation IDs and reply queues with configurable timeouts.

### Auth Middleware

```typescript
import { authenticateToken } from "@ascend/shared";
router.get("/protected", authenticateToken, controller.handle);
```

Extracts the Bearer token from the Authorization header, verifies the JWT, and sets `req.user` with the decoded payload (user ID, role).

## Models

| File | Types |
|------|-------|
| user.ts | User account data |
| profile.ts | Profile details, experience, education |
| post.ts | Posts, comments, reactions |
| message.ts | Conversations, messages |
| connection.ts | Connection requests |
| follows.ts | Follow relationships |
| notification.ts | Notification types and payloads |
| job.ts | Job listings |
| job_application.ts | Job applications |
| company.ts | Company profiles |
| subscription.ts | Premium subscriptions |
| file.ts | File metadata |
| report.ts | User/content reports |
| survey.ts | Surveys |
| announcement.ts | Announcements |
| feature.ts | Feature flags |
| usage.ts | Usage tracking |

## Dependencies

| Package | Purpose |
|---------|---------|
| pg | PostgreSQL client |
| amqplib | RabbitMQ client |
| express | HTTP framework |
| jsonwebtoken | JWT sign/verify |
| express-validator | Request validation |
| cors | CORS middleware |
| dotenv | Environment variables |
