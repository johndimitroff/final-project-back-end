const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user-model.js");

const router = express.Router();

//SIGN UP
router.post("/signup", (req, res, next) => {
  const { firstName, lastName, email, originalPassword } = req.body;

  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);

  User.create({ firstName, lastName, email, encryptedPassword })
    .then(userDoc => {
      req.logIn(userDoc, () => {
        userDoc.encryptedPassword = undefined;
        res.json({ userDoc });
      });
    })
    .catch(err => next(err));
});

// LOGIN
router.post("/login", (req, res, next) => {
  const { email, originalPassword } = req.body;

  // first check to see if there's a document with that email
  User.findOne({ email: { $eq: email } })
    .then(userDoc => {
      // "userDoc" will be empty if the email is wrong (no document in database)
      if (!userDoc) {
        // create an error object to send to our handler with "next()"
        next(new Error("incorrect email."));
        return;
      }

      //second, check the password
      const { encryptedPassword } = userDoc;
      // "compareSync()" will return false if the "originalPassword" is wrong
      if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
        //create an error object to send to our handler with "next()"
        next(new Error("Password is wrong."));
        return;
      }

      //finally, log the user in
      // "req.logIn()" is a Passport method that calls "serializeUser()"
      // (that saves the USER ID in the session)
      req.logIn(userDoc, () => {
        //hide "encryptedPassword" before sending the JSON (it's a security risk)
        userDoc.encryptedPassword = undefined;
        res.json({ userDoc });
      });
    })
    .catch(err => next(err));
});

// LOGOUT
router.delete("/logout", (req, res, next) => {
  // "req.logOut()" is a Passport method that removes the user ID from session
  req.logOut();
  res.json({ userDoc: null });
});

//RENDER A PAGE ONE WAY OR ANOTHER BASED ON WHETHER OR NOT THE USER IS LOGGED IN OR NOT
router.get("/checklogin", (req, res, next) => {
  if (req.user) {
    req.user.encryptedPassword = undefined;
    res.json({ userDoc: req.user });
  } else {
    res.json({ userDoc: null });
  }
});

module.exports = router;
