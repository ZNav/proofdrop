require("dotenv").config();

const key = process.env.PRIVATE_KEY;
console.log("Key length:", key.length);
console.log("Valid format:", /^[a-fA-F0-9]{64}$/.test(key));

