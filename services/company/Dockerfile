FROM node:18
WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY packages/shared /app/packages/shared
COPY services/company /app/services/company

RUN npm install

WORKDIR /app/packages/shared
RUN npm run build

WORKDIR /app/services/company
RUN npm run build

EXPOSE 3003
CMD ["npm", "start"]