FROM node:18
WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY packages/shared /app/packages/shared
COPY services/user /app/services/user

RUN npm install

WORKDIR /app/packages/shared
RUN npm run build

WORKDIR /app/services/user
RUN npm run build

EXPOSE 3002
CMD ["npm", "start"]