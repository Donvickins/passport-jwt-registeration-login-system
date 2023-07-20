const express = require("express");
const router = express.Router();
const Bcrypt = require("bcrypt");
const User = require("../config/database");
const { issueJwt } = require("../config/util");
const Passport = require("../auth/auth");

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get(
  "/protected-route",
  Passport.authenticate("jwt", { failureRedirect: "/login", session: false }),
  (req, res) => {
    res.status(200).send({ success: true, message: "You are authorised" });
  }
);

router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  //Check if user exists

  User.findOne({ username: username }).then((user) => {
    if (!user) {
      return res
        .status(401)
        .send({ success: false, message: "User not found" });
    } else {
      //Check if user password is correct

      const hashedPassword = user.password;
      Bcrypt.compare(password, hashedPassword, (err, result) => {
        if (err) {
          console.log(err);
        }

        if (result === false) {
          return res
            .status(401)
            .send({ success: false, message: "Password incorrect" });
        }

        //If password is correct, issue a jwt token with expiry date // Here its 1day
        if (result === true) {
          const issuedUser = issueJwt(user);
          res.status(200).send({
            success: true,
            user: user.username,
            token: issuedUser.token,
            expires: issuedUser.expires,
          });
        }
      });
    }
  });
});

router.post("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/register", (req, res) => {
  //Check if there is an existing user
  User.findOne({ username: req.body.username }).then((user) => {
    if (user) {
      return res
        .status(401)
        .send({ success: false, message: "User already exist" });
    } else {
      //Encrypt user password, issue them a jwtToken and store user in the database
      Bcrypt.hash(req.body.password, 12, (err, hashedPassword) => {
        if (!err) {
          const newUser = new User({
            username: req.body.username,
            password: hashedPassword,
          });
          newUser.save().then((user) => {
            const jwtUser = issueJwt(user);
            return res.status(200).send({
              success: true,
              message: "User created successfully",
              user: user.username,
              token: jwtUser.token,
              expires: jwtUser.expires,
            });
          });
        } else {
          return res.status(501).send({
            success: false,
            message: "Server error: Failed to save user to database",
          });
        }
      });
    }
  });
});

module.exports = router;
