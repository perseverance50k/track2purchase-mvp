const express = require("express");

const { add: addUser, verify: verifyUser } = require("./service");

const router = express.Router();

// --- REGISTRATION ---
router.post("/register", async (req, res, next) => {
  const credentials = req.body;

  try {
    const created = await addUser(credentials);
    res.send(created).status(201);
  } catch (e) {
    next(e);
  }
});

// --- LOGIN ---
router.post("/login", async (req, res, next) => {
  const credentials = req.body;

  try {
    const verified = verifyUser(credentials);
    res.send(verified).status(200);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
