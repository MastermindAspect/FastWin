FROM node:13.6.0

WORKDIR /rest-api/

COPY package*.json ./

RUN npm install

COPY . src

CMD ["npm", "run", "api"]
