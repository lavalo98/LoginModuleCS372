#FROM node:16
FROM ubuntu
RUN apt update && apt install -y nodejs npm
RUN npm install express
RUN npm install body-parser
RUN apt clean
WORKDIR /usr/src/app
COPY * ./
EXPOSE 80
CMD ["node", "Server"]
