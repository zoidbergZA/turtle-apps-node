# trtl-apps
a node-js package for interacting with turtle apps.

[API Documentation can be found here](https://zoidbergza.github.io/turtle-apps-node/modules/_trtlapp_.html)

## Quickstart

Install the package

`npm install trtl-apps`

Initialize your app

```ts
import { TrtlApp } from 'trtl-apps';

TrtlApp.initialize('YOUR_APP_ID', 'YOUR_APP_SECRET');
```

Create users

```ts
const [bobId, error] = await TrtlApp.createUser();
const [aliceId, error] = await TrtlApp.createUser();
```

## Contributing

### Generate documentation website

The copyfiles package must be installed globally

`npm i copyfiles -g`

Use the following command to generate the documentation site.

`npm run docs`
