FROM node:18
WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY packages/shared /app/packages/shared
COPY services/auth /app/services/auth

RUN npm install

WORKDIR /app/packages/shared
RUN npm run build

WORKDIR /app/services/auth
RUN npm run build

EXPOSE 3001
CMD ["npm", "start"]