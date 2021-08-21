FROM node:13.6.0

WORKDIR /singlepage

COPY package*.json ./

RUN npm install

COPY . src

CMD ["npm", "run", "spa"]
