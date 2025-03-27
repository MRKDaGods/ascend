FROM node:18
WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY packages/shared /app/packages/shared
COPY services/connection /app/services/connection

RUN npm install

WORKDIR /app/packages/shared
RUN npm run build

WORKDIR /app/services/connection
RUN npm run build

EXPOSE 3006
CMD ["npm", "start"]