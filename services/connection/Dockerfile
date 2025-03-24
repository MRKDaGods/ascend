FROM node:18
WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY packages/shared /app/packages/shared
COPY services/post /app/services/post

RUN npm install

WORKDIR /app/packages/shared
RUN npm run build

WORKDIR /app/services/post
RUN npm run build

EXPOSE 3006
CMD ["npm", "start"]