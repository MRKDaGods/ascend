FROM node:18
WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY packages/shared /app/packages/shared
COPY services/notification /app/services/notification

RUN npm install

WORKDIR /app/packages/shared
RUN npm run build

WORKDIR /app/services/notification
RUN npm run build

EXPOSE 3004
CMD ["npm", "start"]