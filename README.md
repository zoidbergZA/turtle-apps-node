# trtl-apps
a node-js package for interacting with turtle apps.

[API Documentation can be found here](https://zoidbergza.github.io/turtle-apps-node/modules/_trtlapp_.html)

## Quickstart

Create an app using the [TRTL apps console](https://trtlapps.io)

Install the package

`npm install trtl-apps --save`

Initialize your app

```ts
import { TrtlApp } from 'trtl-apps';

TrtlApp.initialize('YOUR_APP_ID', 'YOUR_APP_SECRET');
```

Create users

```ts
const [aliceId, error]  = await TrtlApp.createUser();
const [bobId, error]    = await TrtlApp.createUser();
```

## Contributing

### Generate documentation website

The copyfiles package must be installed globally

`npm i copyfiles -g`

Use the following command to generate the documentation site.

`npm run docs`
