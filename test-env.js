require("dotenv").config();

console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY);
console.log("Length:", process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY.length : "undefined");
console.log("Valid hex:", /^[a-fA-F0-9]{64}$/.test(process.env.PRIVATE_KEY || ""));

