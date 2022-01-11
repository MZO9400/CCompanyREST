FROM mhart/alpine-node:latest as builder
WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN [ "npm", "install" ]

COPY . .

RUN ["npm", "run", "build"]


FROM mhart/alpine-node:latest as runner

WORKDIR /app
CMD [ "npm", "start" ]
EXPOSE 3000

COPY --from=builder /app/.build ./.build
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .

RUN ["npm", "install", "--production"]
