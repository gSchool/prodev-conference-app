FROM node:15.8.0-alpine3.10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --prod

# Bundle app source
COPY . .

# Add an entrypoint to wait for postgres to be up and run migrations
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod 777 /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["sh","docker-entrypoint.sh"]

CMD [ "npm", "run", "dev" ]
