
# Firebase Functions

## Run locally

```bash
firebase emulators:start
```

## Set environment variables

```bash
firebase functions:config:set api.key="SECRET_API_KEY",api.url="API_URL"
```

## Ussage of environment variables

```js
const functions = require('firebase-functions');
const apiKey = functions.config().api.key;
const apiUrl = functions.config().api.url;
```

## Check environment variables

```bash
firebase functions:config:get api.key
```

## Deploy

```
npm run deploy
```

```bash
firebase deploy --only functions
```



