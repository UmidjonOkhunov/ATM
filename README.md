# ATM
Simple ATM Controller using Node.js + Express

## Local Development

### Clone the repository and enter it
In the terminal
```bash
git clone https://github.com/UmidjonOkhunov/ATM.git

cd ATM
```
### Run the API server

```bash
# Initial setup
npm install

# Start the server
npm start
```

Open http://localhost:3001/atm to view it in the browser.

### Run tests

```bash
npm test
```

### Install new npm packages for Node

```bash
npm install package-name --save
```

## Available actions

> Insert Card => PIN number => Select Account => See Balance/Deposit/Withdraw

- Insert card = `http://localhost:3001/atm/insert/[card_id]`
- Input PIN = `http://localhost:3001/atm/pin/[pin_num]`
- Select Account Type = `http://localhost:3001/atm/account/[account_type]`
- Balance Check = `http://localhost:3001/atm/balance`
- Deposit = `http://localhost:3001/atm/deposit/[amount]`
- Withdraw = `http://localhost:3001/atm/withdraw/[amount]`

**NOTE**: Actions can be performed only in the order given in the action flow

## Overview

```
ATM-controller
├── README.md
├── node_modules
├── controllers
│   ├── atm.js
├── db
│   ├── atmDb.js
│   ├── bank.js
├── tests
│   ├── atm.test.js
├── utils
│   ├── config.js
│   ├── logger.js
│   ├── middleware.js
├── package.json
├── package-lock.json
├── .gitignore
├── .eslintrc.js
├── .env
├── App.js
├── index.js

```

- Bank API is simulted by a fake database in `db/bank.js`
    ``` javascript
    // I'll assume that this is the bank API
    const cards = [
      {
        id: "1", // Card ID
        pin: "1111",
        accounts: [
          {
            type: "general",
            balance: 100,
          },
          {
            type: "savings",
            balance: 50,
          },
        ],
        // Real database would have timestamp, some bank info to connect to the bank, etc
        // Also what bank the card/account belongs to would be important
      },
      ...
     ]
    ```
- ATM's temporary data is stored in `db/atmDb.js`
    -    It provides functions to manipulate its ATM database. e.g.
    ``` javascript
    module.exports = {
      storeInsertedCardNumber,
      deleteInsertedCardInfo,
      ...
    };
    ```
    


