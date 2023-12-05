# Fetching the minified node image on apline linux
FROM node:slim
ENV NODE_ENV development
WORKDIR /app
COPY . .
RUN npm install
CMD [ "node", "index.js" ]
EXPOSE 5000