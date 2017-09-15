FROM node:8

WORKDIR /app

ADD package-lock.json .
ADD package.json .
RUN npm i
ADD . .

ENTRYPOINT ["npm"]
CMD ["run","start"]



