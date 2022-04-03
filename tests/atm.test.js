const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

describe("Essential Workflow", () => {
  test("asks to insert the card", async () => {
    await api
      .get("/atm")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 100000);

  test("card is inserted successfully", async () => {
    await api
      .get("/atm/insert/1")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 100000);

  test("pin is correct", async () => {
    await api
      .get("/atm/pin/1111")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 100000);

  test("choose account type", async () => {
    await api
      .get("/atm/account/general")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 100000);

  test("check balance", async () => {
    const response = await api
      .get("/atm/balance")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.balance).toBe(100);
  }, 100000);

  test("deposit 1000 dollars", async () => {
    const response = await api
      .get("/atm/deposit/1000")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.balance).toBe(1100);
  }, 100000);

  test("Bad request: deposit NEGATIVE 1000 dollars", async () => {
    const response = await api
      .get("/atm/deposit/-1000")
      .expect(400)
      .expect("Content-Type", /application\/json/);
  }, 100000);

  test("withdraw 500 dollars", async () => {
    const response = await api
      .get("/atm/withdraw/500")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.balance).toBe(600);
  }, 100000);

  test("Bad request: withdraw NEGATIVE 500 dollars", async () => {
    const response = await api
      .get("/atm/withdraw/-500")
      .expect(400)
      .expect("Content-Type", /application\/json/);
  }, 100000);

  test("Bad request: withdraw more than your current balance", async () => {
    const response = await api
      .get("/atm/withdraw/2000")
      .expect(400)
      .expect("Content-Type", /application\/json/);
  }, 100000);
});

describe("other error case tests", () => {
  test("incorrect card id provided", async () => {
    await api
      .get("/atm/insert/9274")
      .expect(404)
      .expect("Content-Type", /application\/json/);
  }, 100000);

  test("incorrect pin provided", async () => {
    await api
      .get("/atm/insert/1")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    await api
      .get("/atm/pin/2893")
      .expect(404)
      .expect("Content-Type", /application\/json/);
  }, 100000);

  test("unavailable account type is chosen", async () => {
    await api
      .get("/atm/insert/1")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    await api
      .get("/atm/pin/1111")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    await api
      .get("/atm/account/golden")
      .expect(404)
      .expect("Content-Type", /application\/json/);
  }, 100000);
});
