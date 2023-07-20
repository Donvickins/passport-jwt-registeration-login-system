require("dotenv").config();
const express = require("express");
const Passport = require("./auth/auth");
const ejs = require("ejs");
const router = require("./routes/router");
const app = express();

const PORT = process.env.PORT || 4000;

app
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(express.static("/public"))
  .set("view engine", "ejs")
  .use(Passport.initialize())
  .use(router);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
