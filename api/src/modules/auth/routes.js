const express = require("express");

const { getCollection } = require("../database");

const router = express.Router();

const USERS_COLLECTION = "users";

router.post("/register", async (req, res) => {
  const user = req.body;
  const collection = getCollection(USERS_COLLECTION);

  const result = await collection.insertOne(user);
  res.send(result).status(201);
});

router.post("/login", async (req, res) => {
  const credentials = req.body;
  const collection = getCollection(USERS_COLLECTION);

  const { email, password } = credentials;
  const user = await collection.findOne({ email });

  if (!user || user.password !== password) {
    const payload = {
      error: "Wrong credentials provided!",
    };
    res.send(payload).status(403);
    return;
  }

  const payload = {
    success: "Successfully logged in!",
  };

  res.send(payload).status(200);
});

module.exports = router;
