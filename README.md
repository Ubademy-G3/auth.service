# auth.service
Directory structure:
```tree
├── index.js
├── src
│   ├── infrastructure
│   │   └── db
│   │       └──  UserShemas.js  
│   │   └── routes
│   │       └──  Auth.js
│   │   └── security
│   │       └──  JwtGenerator.js
│   ├── persistence
│   │   └── repositories
│   │       └── UserRepositoryMongo.js
│   ├── application
│   │   └── controllers
│   │       └── AuthController.js
│   │   └── serializers
│   │       └── UserSerializer.js
│   │   └── useCases
│   │       └── Authenticate.js
│   │       └── Register.js
│   └── domain
│       └── UserEntity.js
│       └── UserRepository.js
├── monitoring
├── deploy
└── tests
```
