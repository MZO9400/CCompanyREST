FROM mhart/alpine-node:latest

WORKDIR /app
CMD [ "npm", "start" ]
EXPOSE 3000

COPY package.json .
COPY package-lock.json .
RUN [ "npm", "install" ]
COPY . .
