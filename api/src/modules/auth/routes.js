const express = require("express");
const httpStatus = require("http-status");

const { add: addUser, verify: verifyUser } = require("./service");

const router = express.Router();

// --- REGISTRATION ---
router.post("/register", async (req, res, next) => {
  const credentials = req.body;

  try {
    await addUser(credentials);
    res.send({ success: true }).status(httpStatus.CREATED);
  } catch (e) {
    next(e);
  }
});

// --- LOGIN ---
router.post("/login", async (req, res, next) => {
  const credentials = req.body;
  const cookies = req.cookies;

  try {
    const verified = await verifyUser(credentials);
    res.send(verified).status(httpStatus.OK);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
