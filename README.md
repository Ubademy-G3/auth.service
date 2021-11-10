# Auth Microservice

[![CI](https://github.com/Ubademy-G3/auth.service/actions/workflows/test.yml/badge.svg)](https://github.com/Ubademy-G3/auth.service/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/Ubademy-G3/auth.service/branch/main/graph/badge.svg?token=OD8Z2SGLLB)](https://codecov.io/gh/Ubademy-G3/auth.service)

Service for authentication.

This service provides:

* User registration
* User authentication via email and password
* Token verification
* Password reset

## Directory structure

```tree
├── index.js
├── src
│   ├── infrastructure
│   │   ├── db
│   │   │   └──  UserSchema.js  
│   │   ├── routes
│   │   │   └──  Auth.js
│   │   └── security
│   │       └──  JwtGenerator.js
│   ├── persistence
│   │   └── repositories
│   │       └── UserRepositoryMongo.js
│   ├── application
│   │   ├── controllers
│   │   │   └── AuthController.js
│   │   ├──serializers
│   │   │   └── UserSerializer.js
│   │   └── useCases
│   │       ├── Authenticate.js
│   │       └── Register.js
│   └── domain
│       ├──UserEntity.js
│       └── UserRepository.js
├── monitoring
├── deploy
└── tests
```

# Local Environment

## Requirements 

* Docker
* Docker-compose

## Environment variables

To run this application you need to define the following environment variables:

```
JWT_SECRET_KEY=YOUR_SECRET_KEY
AUTH_APIKEY=YOUR_AUTH_SERVICE_APIKEY
USER=EMAIL_ADDRESS_SENDER #for password recovery
PASS=EMAIL_PASSWORD_SENDER #for password recovery
SERVICE=EMAIL_SERVICE
PASSWORD_RESET_URL=PASSWORD_RESET_URL
```

## Build and Deploy Services

```docker-compose up -d --build```

This command deploys the services:

* `authservice_node`: Web Service
* `mongo`: Database
* `mongo-express`: Database admin

## Stop services

```docker-compose stop```


You can try it out at <https://staging-auth-service-app.herokuapp.com/api-docs>
