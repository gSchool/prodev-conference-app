FROM node:15.8.0-alpine3.12
WORKDIR /usr/src/app
COPY package*.json ./
RUN ["npm", "install"]
COPY . .

# This service needs to wait until PostgreSQL is running
# in the database Docker container. To do that, use the
# docker-compose-wait tool. It will wait until each host
# specified in the environment variable WAIT_HOSTS are up
# and running before continuing.
# See https://github.com/ufoscout/docker-compose-wait
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

EXPOSE 80

# Use the /wait command to wait for PostgreSQL
# Run the migrations
# Start the app
CMD /wait && npm run start
