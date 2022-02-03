FROM node:16
WORKDIR /usr/src/app
COPY * ./
EXPOSE 80
CMD ["node", "Server"]
