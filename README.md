# trtl-apps
a node-js package for interacting with turtle apps.

[Full API Documentation can be found here](https://zoidbergza.github.io/turtle-apps-node/classes/_trtlapp_.trtlapp.html)

## Quickstart

Create an app using the [TRTL apps console](https://trtlapps.io)

### Install the package

`npm install trtl-apps --save`

### Initialize your app

```ts
import { TrtlApp } from 'trtl-apps';

TrtlApp.initialize('YOUR_APP_ID', 'YOUR_APP_SECRET');
```

### Create accounts

```ts
const [alice, error]  = await TrtlApp.createAccount();
const [bob, error]    = await TrtlApp.createAccount();

console.log(`alice deposit address: ${alice.depositAddress}`);
```

### Transfer from one account to another

```ts
const [transfer, error] = await TrtlApp.transfer(alice.id, bob.id, 120);

if (transfer) {
    console.log(`transfer succeeded, transfer id: ${transfer.id}`);
}
```

### Account preview withdrawal

```ts
const [preview, error] = await TrtlApp.withdrawalPreview(
                            '8RgwiWmgiYKQlUHWGaTW',
                            2100,
                            'TRTLv2fdtVVDjWKueQ1aAETchiGVWkDvi1ATNgqZ3nKc7biCLm7KzLYeCzfS46mWYNRe8JaMPcTGWAR874kkN2zQ7Mt16J1vzcA');

if (preview) {
 console.log(`Withdrawal preview created successfully, id: ${preview.id}, fee: ${preview.fee}`);
}
```

### Account withdraw

```ts
const [withdrawal, error] = await TrtlApp.withdraw(preview.id);

if (withdrawal) {
 console.log(`Withdrawal request created successfully and is beeing processed, paymentId: ${withdrawal.paymentId}`);
}
```

## Contributing

### Documentation

Compile the javascript

`tsc`

Generate documentation website. The copyfiles package must be installed globally

`npm i copyfiles -g`

Use the following command to generate the static documentation site.

`npm run docs`

Documentation is automatically hosted using github pages with each commit to the master branch
