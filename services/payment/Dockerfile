FROM node:18
WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY packages/shared /app/packages/shared
COPY services/payment /app/services/payment

RUN npm install

WORKDIR /app/packages/shared
RUN npm run build

WORKDIR /app/services/payment
RUN npm run build

EXPOSE 3011
CMD ["npm", "start"]