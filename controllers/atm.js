// const config = require("../utils/config");
const bankAPI = require('../db/bank');
const atmDb = require('../db/atmDb');
const atmRouter = require('express').Router();


atmRouter.get('/', (request, response) => {
    response.send('<h1>Please Insert your Card at atm/insert/[your card id]</h1>')
})

// This is the simulation of card insertion
// The card is considered to be inserted if the cardId exists in the database
atmRouter.get('/insert/:card_id', (request, response) => {
    const card_id = request.params.card_id
    const validCard = bankAPI.cardExists(card_id) // Checking card validity through bankAPI
    
    if (validCard !== undefined) {
        atmDb.storeInsertedCardNumber(card_id)  // Save Card ID in temporary DB
        response.send('<h1>Now input your pin number to atm/pin/[your pin]</h1>')
      } else {
        response.status(404).send('<h1>Error! Cannot find your card in the system</h1>').end()
      }
})

// PIN number
atmRouter.get('/pin/:pin_num', (request, response) => {
    const pin_num = request.params.pin_num
    const card_id = atmDb.getInsertedCardNumber()
    if (card_id ===undefined){
        response.status(404).send('<h1>No card is inserted</h1>').end()
        return;
    }
    const validPIN = bankAPI.validatePIN(card_id,pin_num)

    if (validPIN !== undefined) {
        atmDb.storeInsertedCardPIN(pin_num)  // Save PIN number in temporary DB
        response.send('<h1>Now input your select one of your accounts to atm/account/[savings or general]</h1>')
      } else {
        atmDb.deleteInsertedCardInfo() // Remove current card info from temporary DB
        response.status(404).send('<h1>Incorrect PIN number. Please reinsert your card and try again!</h1>').end()
      }
})

// Select Account
atmRouter.get('/account/:account_type', (request, response) => {
    const account_type = request.params.account_type
    const card_id = atmDb.getInsertedCardNumber()
    const pin_num = atmDb.getInsertedCardPIN()

    if (card_id ===undefined || pin_num === undefined){
        response.status(404).send('<h1>Unauthorized access!</h1>').end()
        return;
    }

    const validAccount = bankAPI.checkAccount(card_id, pin_num, account_type) 

    if (validAccount !== undefined) {
        atmDb.storeAccountType(account_type)  // Save account type in temporary DB
        response.send(`<h1>You can choose to </h1>
        <h2> check your balance - atm/balance </h2>
        <h2> deposit - atm/deposit/[amount] </h2>
        <h2> withdraw - atm/withdraw/[amount] </h2>
        `)
      } else {
        atmDb.deleteInsertedCardInfo() // Remove current card info from temporary DB
        response.status(404).send('<h1>Unexpected Error occurred. Please reinsert your card and try again!</h1>').end()
      }
})

// Check balance
atmRouter.get('/balance', (request, response) => {
    const card_id = atmDb.getInsertedCardNumber()
    const pin_num = atmDb.getInsertedCardPIN()
    const account_type = atmDb.getAccountType()

    if (card_id ===undefined || pin_num === undefined || account_type === undefined){
        response.status(404).send('<h1>Unauthorized access!</h1>').end()
        return;
    }

    const balance = bankAPI.checkBalance(card_id,pin_num, account_type) 

    if (balance !== undefined) {
        response.send(`<h1>Your balance is $${balance} </h1>`)
      } else {
        atmDb.deleteInsertedCardInfo() // Remove current card info from temporary DB
        response.status(404).send('<h1>Unexpected Error occurred. Please reinsert your card and try again!</h1>').end()
      }
})

// Deposit
atmRouter.get('/deposit/:amout', (request, response) => {
    const amount = Number(request.params.amout)
    const card_id = atmDb.getInsertedCardNumber()
    const pin_num = atmDb.getInsertedCardPIN()
    const account_type = atmDb.getAccountType()

    if (card_id ===undefined || pin_num === undefined || account_type === undefined){
        response.status(404).send('<h1>Unauthorized access!</h1>').end()
        return;
    }

    const newBalance = bankAPI.deposit(card_id,pin_num, account_type, amount) 

    if (newBalance !== undefined) {
        response.send(`<h1>Successfully deposited! Your new balance is $${newBalance} </h1>`)
      } else {
        atmDb.deleteInsertedCardInfo() // Remove current card info from temporary DB
        response.status(404).send('<h1>Unexpected Error occurred. Please reinsert your card and try again!</h1>').end()
      }
})

// Withdraw
atmRouter.get('/withdraw/:amout', (request, response) => {
    const amount = Number(request.params.amout)
    const card_id = atmDb.getInsertedCardNumber()
    const pin_num = atmDb.getInsertedCardPIN()
    const account_type = atmDb.getAccountType()

    if (card_id ===undefined || pin_num === undefined || account_type === undefined){
        response.status(404).send('<h1>Unauthorized access!</h1>').end()
        return;
    }

    const newBalance = bankAPI.withdraw(card_id,pin_num, account_type, amount) 

    if ((typeof newBalance) === 'number') {
        response.send(`<h1>Successfully withdrawn! Your new balance is $${newBalance} </h1>`)
      } 
    else if ((typeof newBalance) === 'string'){
        response.status(404).send(newBalance).end()
    }
    else {
        atmDb.deleteInsertedCardInfo() // Remove current card info from temporary DB
        response.status(404).send('<h1>Unexpected Error occurred. Please reinsert your card and try again!</h1>').end()
      }
})


module.exports = atmRouter;