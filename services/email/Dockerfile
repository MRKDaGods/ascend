FROM node:18
WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY packages/shared /app/packages/shared
COPY services/email /app/services/email

RUN npm install

WORKDIR /app/packages/shared
RUN npm run build

WORKDIR /app/services/email
RUN npm run build

EXPOSE 3069
CMD ["npm", "start"]