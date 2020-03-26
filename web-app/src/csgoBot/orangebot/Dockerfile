FROM node:13.6.0

WORKDIR /csgo-bot/

COPY package*.json ./

RUN npm install

COPY . src

CMD ["npm", "run", "bot"]
