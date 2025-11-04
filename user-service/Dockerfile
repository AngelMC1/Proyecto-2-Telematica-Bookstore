FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5002 50051

ENV NODE_ENV=production

CMD ["npm", "start"]

