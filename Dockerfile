#FROM node:16
FROM ubuntu
ENV DEBIAN_FRONTEND=noninteractive
RUN apt update && apt install -y nodejs npm
RUN npm install express
RUN npm install body-parser
RUN npm install mongoose
RUN apt clean
WORKDIR /usr/src/app
COPY * ./
COPY node_modules /node_modules
COPY Models Models
EXPOSE 80
CMD ["node", "Server"]
