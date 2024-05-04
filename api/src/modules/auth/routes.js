const express = require("express");
const httpStatus = require("http-status");

const { add: addUser, verify: verifyUser } = require("./service");
const { createJwt } = require("./utils");

const router = express.Router();

const JWT_EXPIRATION_PERIOD = process.env.JWT_EXPIRATION_PERIOD;

// --- REGISTRATION ---
router.post("/register", async (req, res, next) => {
  const credentials = req.body;

  try {
    const addedUser = await addUser(credentials);
    res.send({ created: addedUser }).status(httpStatus.CREATED);
  } catch (e) {
    next(e);
  }
});

// --- LOGIN ---
router.post("/login", async (req, res, next) => {
  const credentials = req.body;
  try {
    const verified = await verifyUser(credentials);

    const tokenPayload = {
      sub: verified.email,
    };

    const tokenOptions = {
      expiresIn: JWT_EXPIRATION_PERIOD,
    };

    const token = createJwt(tokenPayload, tokenOptions);

    res.cookie("Authentication", token, { httpOnly: true });
    res.send(verified).status(httpStatus.OK);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
