// const config = require("../utils/config");
const bankAPI = require("../db/bank");
const atmDb = require("../db/atmDb");
const atmRouter = require("express").Router();

atmRouter.get("/", (request, response) => {
  response.json({
    message: "Please Insert your Card at atm/insert/[your card id]",
  });
});

// This is the simulation of card insertion
// The card is considered to be inserted if the cardId exists in the database
atmRouter.get("/insert/:card_id", (request, response) => {
  const card_id = request.params.card_id;
  const validCard = bankAPI.cardExists(card_id); // Checking card validity through bankAPI

  if (validCard === true) {
    atmDb.storeInsertedCardNumber(card_id); // Save Card ID in temporary DB
    response.json({
      message: "Now input your pin number to atm/pin/[your pin]",
    });
  } else {
    response
      .status(404)
      .json({ error: "Error! Cannot find your card in the system" })
      .end();
  }
});

// PIN number
atmRouter.get("/pin/:pin_num", (request, response) => {
  const pin_num = request.params.pin_num;
  const card_id = atmDb.getInsertedCardNumber();
  if (card_id === undefined) {
    response.status(404).json({ error: "No card is inserted" }).end();
    return;
  }
  const validPIN = bankAPI.validatePIN(card_id, pin_num);

  if (validPIN === true) {
    atmDb.storeInsertedCardPIN(pin_num); // Save PIN number in temporary DB
    response.json({
      message:
        "Now input your select one of your accounts to atm/account/[savings or general]",
    });
  } else {
    atmDb.deleteInsertedCardInfo(); // Remove current card info from temporary DB
    response
      .status(404)
      .json({
        error: "Incorrect PIN number. Please reinsert your card and try again!",
      })
      .end();
  }
});

// Select Account
atmRouter.get("/account/:account_type", (request, response) => {
  const account_type = request.params.account_type;
  const card_id = atmDb.getInsertedCardNumber();
  const pin_num = atmDb.getInsertedCardPIN();

  if (card_id === undefined || pin_num === undefined) {
    response.status(401).json({ error: "Unauthorized access!" }).end();
    return;
  }

  const validAccount = bankAPI.checkAccount(card_id, pin_num, account_type);

  if (validAccount === true) {
    atmDb.storeAccountType(account_type); // Save account type in temporary DB
    response.json({
      message:
        "You can choose to 1. check your balance - atm/balance. 2. deposit - atm/deposit/[amount]. 3.  withdraw - atm/withdraw/[amount]",
    });
  } else {
    atmDb.deleteInsertedCardInfo(); // Remove current card info from temporary DB
    response
      .status(404)
      .json({
        error:
          "Unexpected Error occurred. Please reinsert your card and try again!",
      })
      .end();
  }
});

// Check balance
atmRouter.get("/balance", (request, response) => {
  const card_id = atmDb.getInsertedCardNumber();
  const pin_num = atmDb.getInsertedCardPIN();
  const account_type = atmDb.getAccountType();

  if (
    card_id === undefined ||
    pin_num === undefined ||
    account_type === undefined
  ) {
    response.status(401).json({ error: "Unauthorized access!" }).end();
    return;
  }

  const balance = bankAPI.checkBalance(card_id, pin_num, account_type);

  if (balance !== undefined) {
    response.json({ message: `Your balance is $${balance} `, balance });
  } else {
    atmDb.deleteInsertedCardInfo(); // Remove current card info from temporary DB
    response
      .status(400)
      .json({
        error:
          "Unexpected Error occurred. Please reinsert your card and try again!",
      })
      .end();
  }
});

// Deposit
atmRouter.get("/deposit/:amout", (request, response) => {
  const amount = Number(request.params.amout);
  const card_id = atmDb.getInsertedCardNumber();
  const pin_num = atmDb.getInsertedCardPIN();
  const account_type = atmDb.getAccountType();

  if (
    card_id === undefined ||
    pin_num === undefined ||
    account_type === undefined
  ) {
    response.status(401).json({ error: "Unauthorized access!" }).end();
    return;
  }

  if (amount < 0) {
    response.status(400).json({ error: "Invalid amount is input" }).end();
    return;
  }

  const newBalance = bankAPI.deposit(card_id, pin_num, account_type, amount);

  if (newBalance !== undefined) {
    response.json({
      message: `Successfully deposited! Your new balance is $${newBalance}`,
      balance: newBalance,
    });
  } else {
    atmDb.deleteInsertedCardInfo(); // Remove current card info from temporary DB
    response
      .status(400)
      .json({
        message:
          "Unexpected Error occurred. Please reinsert your card and try again!",
      })
      .end();
  }
});

// Withdraw
atmRouter.get("/withdraw/:amout", (request, response) => {
  const amount = Number(request.params.amout);
  const card_id = atmDb.getInsertedCardNumber();
  const pin_num = atmDb.getInsertedCardPIN();
  const account_type = atmDb.getAccountType();

  if (
    card_id === undefined ||
    pin_num === undefined ||
    account_type === undefined
  ) {
    response.status(401).json({ error: "Unauthorized access!" }).end();
    return;
  }

  if (amount < 0) {
    response.status(400).json({ error: "Invalid amount is input" }).end();
    return;
  }

  const newBalance = bankAPI.withdraw(card_id, pin_num, account_type, amount);

  if (typeof newBalance === "number") {
    response.json({
      message: `Successfully withdrawn! Your new balance is $${newBalance}`,
      balance: newBalance,
    });
  } else if (typeof newBalance === "string") {
    response.status(400).json({ error: newBalance }).end();
  } else {
    atmDb.deleteInsertedCardInfo(); // Remove current card info from temporary DB
    response
      .status(400)
      .json({
        error:
          "Unexpected Error occurred. Please reinsert your card and try again!",
      })
      .end();
  }
});

module.exports = atmRouter;
