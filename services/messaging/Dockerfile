FROM node:18
WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY packages/shared /app/packages/shared
COPY services/messaging /app/services/messaging

RUN npm install

WORKDIR /app/packages/shared
RUN npm run build

WORKDIR /app/services/messaging
RUN npm run build

EXPOSE 3010
EXPOSE 3011
CMD ["npm", "start"]