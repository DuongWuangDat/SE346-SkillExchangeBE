FROM node:21.6.0

WORKDIR /usr/local/app

COPY . .

RUN npm install



CMD ["npm", "start"]

