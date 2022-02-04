#FROM node:16
# Start with ubuntu as base
FROM ubuntu

# Set up an environment variable that prevents tzdata package installation
# from locking the build up
ENV DEBIAN_FRONTEND=noninteractive

# Shell commands that are run inside containers to build the image
RUN apt update && apt install -y nodejs npm
RUN npm install express
RUN npm install body-parser
RUN npm install mongoose
RUN apt clean

# Change current working directory inside the image
WORKDIR /usr/src/app

# Copy local files to image filesystem
COPY * ./
COPY node_modules /node_modules
COPY Models Models

# Declare that port 80 is a port open by containers runnning this image
EXPOSE 80

# Declare the command to be run when the container starts ("node Server")
CMD ["node", "Server"]
