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
  {
    id: "2",
    pin: "2222",
    accounts: [
      {
        type: "general",
        balance: 200,
      },
      {
        type: "savings",
        balance: 1000,
      },
    ],
  },
  {
    id: "3",
    pin: "3333",
    accounts: [
      {
        type: "general",
        balance: 350,
      },
      {
        type: "savings",
        balance: 500,
      },
    ],
  },
];

/**
 * @param {string} card_id id of your card linking it to your bank account
 */
const cardExists = (card_id) => {
  const card = cards.find((c) => c.id === card_id);
  return card !== undefined;
};

/**
 * @param {string} card_id id of your card linking it to your bank account
 * @param {string} pin The PIN number of your card
 */
const validatePIN = (card_id, pin) => {
  const card = cards.find((c) => c.id === card_id && c.pin === pin);
  return card !== undefined;
};

/**
 * @param {string} card_id id of your card linking it to your bank account
 * @param {string} pin The PIN number of your card
 * @param {string} account_type  general or savings
 */
const checkAccount = (card_id, pin, account_type) => {
  const card = cards.find((c) => c.id === card_id && c.pin === pin);
  const account = card.accounts.find((acc) => acc.type === account_type);
  return account !== undefined;
};

/**
 * @param {string} card_id id of your card linking it to your bank account
 * @param {string} pin The PIN number of your card
 * @param {string} account_type  general or savings
 */
const checkBalance = (card_id, pin, account_type) => {
  const card = cards.find((c) => c.id === card_id && c.pin === pin);
  const account = card.accounts.find((acc) => acc.type === account_type);
  return account?.balance;
};

/**
 * @param {string} card_id id of your card linking it to your bank account
 * @param {string} pin The PIN number of your card
 * @param {string} account_type  general or savings
 * @param {number} amount  Amount to be deposited
 */
const deposit = (card_id, pin, account_type, amount) => {
  const card = cards.find((c) => c.id === card_id && c.pin === pin);
  const account = card.accounts.find((acc) => acc.type === account_type);
  if (account === undefined) return undefined;
  card.accounts = card.accounts.map((acc) =>
    acc.type === account_type ? { ...acc, balance: acc.balance + amount } : acc
  );
  return account.balance + amount;
};

/**
 * @param {string} card_id id of your card linking it to your bank account
 * @param {string} pin The PIN number of your card
 * @param {string} account_type  general or savings
 * @param {number} amount  Amount to be withdrawn
 */
const withdraw = (card_id, pin, account_type, amount) => {
  const card = cards.find((c) => c.id === card_id && c.pin === pin);
  const account = card.accounts.find((acc) => acc.type === account_type);

  if (account.balance < amount) return "Not enough balance";

  if (account === undefined) return undefined;
  card.accounts = card.accounts.map((acc) =>
    acc.type === account_type ? { ...acc, balance: acc.balance - amount } : acc
  );
  return account.balance - amount;
};

module.exports = {
  cardExists,
  validatePIN,
  checkAccount,
  checkBalance,
  deposit,
  withdraw,
};
