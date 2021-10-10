# Microservicio de Auth

[![CI](https://github.com/Ubademy-G3/auth.service/actions/workflows/test.yml/badge.svg)](https://github.com/Ubademy-G3/auth.service/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/Ubademy-G3/auth.service/branch/main/graph/badge.svg?token=P5PT97QTE2)](https://codecov.io/gh/Ubademy-G3/auth.service)

Directory structure:
```tree
├── index.js
├── src
│   ├── infrastructure
│   │   ├── db
│   │   │   └──  UserShemas.js  
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
