require("dotenv").config();

let PORT = process.env.PORT || 3001;
let SECRET = process.env.SECRET;

module.exports = {
  PORT,
  SECRET,
};
