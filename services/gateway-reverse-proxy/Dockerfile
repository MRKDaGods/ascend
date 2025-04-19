FROM node:18
WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY packages/shared /app/packages/shared
COPY services/gateway-reverse-proxy /app/services/gateway-reverse-proxy

RUN npm install

WORKDIR /app/packages/shared
RUN npm run build

WORKDIR /app/services/gateway-reverse-proxy
RUN npm run build

EXPOSE 8080
CMD ["npm", "start"]