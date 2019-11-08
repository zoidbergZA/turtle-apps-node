# trtl-apps
a node-js package for interacting with turtle apps.

[API Documentation can be found here](https://zoidbergza.github.io/turtle-apps-node/classes/_trtlapp_.trtlapp.html)

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

Request a deposit from a user

```ts
const [depositRequest, error] = await TrtlApp.requestDeposit(aliceId, 420);

if (depositRequest) {
    console.log(`new deposit request created. qr code: ${depositRequest.qrCode}`);
}
```

Transfer from one user to another

```ts
const [transferId, error] = await TrtlApp.userTransfer(aliceId, bobId, 120);

if (transferId) {
    console.log(`user transfer succeeded, transfer id: ${transferId}`);
}
```

Set a user's withdraw address

```ts
const [address, error] = await TrtlApp.setWithdrawAddress(
    bobId,
    'TRTLv32bGBP2cfM3SdijU4TTYnCPoR33g5eTas6n9HamBvu8ozc9BWHZza5j7cmBFSgh4dmmGRongfoEEzcvuAEF8dLxixsS7he');

if (address) {
    console.log(`user withdraw address successfully set to: ${address}`);
}
```

User withdraw

```ts
const [withdrawal, error] = await TrtlApp.withdraw(bobId, 42);

if (withdrawal) {
    console.log(`Withdrawal request created successfully and is beeing processed, paymentId: ${withdrawal.paymentId}`);
}
```

## Contributing

Compile the javascript

`tsc`

### Generate documentation website

The copyfiles package must be installed globally

`npm i copyfiles -g`

Use the following command to generate the documentation site.

`npm run docs`
