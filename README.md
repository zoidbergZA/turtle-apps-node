# trtl-apps
a node-js package for interacting with turtle apps.

[Full API Documentation can be found here](https://zoidbergza.github.io/turtle-apps-node/classes/_trtlapp_.trtlapp.html)

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
const [alice, error]  = await TrtlApp.createUser();
const [bob, error]    = await TrtlApp.createUser();

console.log(`alice deposit address: ${alice.depositAddress}`);
```

Transfer from one user to another

```ts
const [transfer, error] = await TrtlApp.transfer(alice.userId, bob.userId, 120);

if (transfer) {
    console.log(`user transfer succeeded, transfer id: ${transfer.id}`);
}
```

User withdraw

```ts
const [withdrawal, error] = await TrtlApp.withdraw(
    bob.userId,
    42,
    'TRTLv32bGBP2cfM3SdijU4TTYnCPoR33g5eTas6n9HamBvu8ozc9BWHZza5j7cmBFSgh4dmmGRongfoEEzcvuAEF8dLxixsS7he');

if (withdrawal) {
    console.log(`Withdrawal request created successfully and is beeing processed, id: ${withdrawal.id}`);
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
