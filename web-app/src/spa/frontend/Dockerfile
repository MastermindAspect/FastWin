FROM node:13.6.0

WORKDIR /spa/

COPY package*.json ./

RUN npm install

COPY . src

CMD ["npm", "run", "spa"]
