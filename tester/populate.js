// populate.js
const axios = require("axios");
const { faker } = require("@faker-js/faker");

const API_URL = "http://localhost:3000/api/movements"; // Ajusta tu URL

const sendMovement = async () => {
  const movement = {
    authorizationNumber: faker.string.alphanumeric(10).toUpperCase(),
    accountFrom: faker.finance.accountNumber(),
    accountTo: faker.finance.accountNumber(),
    destinationBank: `${faker.number.int({ min: 10, max: 99 })}-${faker.number.int({ min: 100, max: 999 })}`,
    sourceBank: `${faker.number.int({ min: 1000, max: 9999 })}-${faker.finance.accountNumber(6)}`,
    currency: faker.finance.currencyCode(),
    amount: faker.number.float({ min: 10, max: 100000, precision: 0.01 }),
  };

  try {
    const res = await axios.post(API_URL, movement);
    console.log(`✅ Created movement: ${movement.authorizationNumber}`);
  } catch (err) {
    console.error(`❌ Error creating movement:`, err.response?.data || err.message);
  }
};

const main = async () => {
  const total = 100;

  for (let i = 0; i < total; i++) {
    await sendMovement();
  }

  console.log("✅ Finished sending 100 movements.");
};

main();
