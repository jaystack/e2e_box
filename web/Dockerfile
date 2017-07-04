FROM node:6

WORKDIR /app

ADD package-lock.json .
ADD package.json .
RUN npm i
ADD . .
RUN npm run build

# HEALTHCHECK --interval=3s --timeout=3s CMD curl localhost:5000

ENTRYPOINT ["npm"]
CMD ["run","service"]



