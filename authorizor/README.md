# Authorizor and Authenticator Microservice
This bounded context handles authentication and authorization of users interacting with the API. Like the original backend, it has a postgres database. Client requests will come to this service to get a JWT token and microservices will query this microservice to understand authorization.

Based loosely off the diagrams in this post: https://sdtimes.com/apis/securing-microservices-the-api-gateway-authentication-and-authorization/
# Setup

## Locally
It should be the exact same as the Backend setup instructions. Once postgres is setup an migrations run, just a `npm run dev` is needed.

## Docker
Or just run docker-compose one level up to get everything working 