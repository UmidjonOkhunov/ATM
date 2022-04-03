// I'll assume that this is where we store local ATM information
let currentCard = {
  // Schema
  // card_id: '1',
  // pin: '0000',
  // account_type: 'general' or 'savings',  // Cards can have only General and Savings accounts.
};

/**
 * @param {string} card_id Card ID
 */
const storeInsertedCardNumber = (card_id) => {
  currentCard.card_id = card_id;
};

const getInsertedCardNumber = () => {
  return currentCard.card_id;
};

/**
 * @param {string} pin Card PIN number
 */
const storeInsertedCardPIN = (pin) => {
  currentCard.pin = pin;
};

const getInsertedCardPIN = () => {
  return currentCard.pin;
};

/**
 * Delete Inserted Card's Information locally
 */
const deleteInsertedCardInfo = () => {
  currentCard = {};
};

/**
 * @param {string} account_type  general or savings
 */
const storeAccountType = (account_type) => {
  currentCard.account_type = account_type;
};

const getAccountType = () => {
  return currentCard.account_type;
};

module.exports = {
  storeInsertedCardNumber,
  deleteInsertedCardInfo,
  getInsertedCardNumber,
  storeInsertedCardPIN,
  getInsertedCardPIN,
  storeAccountType,
  getAccountType,
};
