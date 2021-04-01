FROM node:15.8.0-alpine3.12
WORKDIR /usr/src/app
COPY package*.json ./
RUN ["npm", "install"]
COPY . .

EXPOSE 80
# Use the /wait command to wait for PostgreSQL
# Run the migrations
# Start the app
CMD npm run migrate -- up && npm run start
