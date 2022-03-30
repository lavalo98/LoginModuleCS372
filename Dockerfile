#FROM node:16
# Start with ubuntu as base
FROM ubuntu

# Set up an environment variable that prevents tzdata package installation
# from locking the build up
ENV DEBIAN_FRONTEND=noninteractive

# Shell commands that are run inside containers to build the image
RUN apt update
RUN apt install -y npm
RUN apt install -y curl
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt install -y nodejs
RUN npm install express
RUN npm install body-parser
RUN npm install mongoose
RUN npm install bootstrap
RUN npm install bcrypt
RUN npm install pug
RUN npm install express-session
RUN npm install connect-mongo
RUN apt clean

# Change current working directory inside the image
WORKDIR /usr/src/app

# Copy local files to image filesystem
COPY * ./
COPY node_modules /node_modules
COPY Models Models
COPY views views
COPY public public
COPY Routes Routes

# Declare that port 80 is a port open by containers runnning this image
EXPOSE 80

# Declare the command to be run when the container starts ("node Server")
CMD ["node", "Server"]
