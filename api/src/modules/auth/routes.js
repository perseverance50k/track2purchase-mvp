const express = require("express");

const { getCollection } = require("../database");

const router = express.Router();

const USERS_COLLECTION = "users";

router.post("/register", async (req, res) => {
  const newUser = req.body;
  const collection = getCollection(USERS_COLLECTION);

  const user = await collection.findOne({ email: newUser.email });

  if (user) {
    const payload = {
      error: "Such a user already exist.",
    };

    res.send(payload).status(403);
    return;
  }

  const result = await collection.insertOne(newUser);
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
