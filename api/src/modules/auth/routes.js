const express = require("express");

const { getDb } = require("../database");

const router = express.Router();

router.post("/register", async (req, res) => {
  const db = getDb();
  const collection = db.collection("users");
  const user = req.body;

  const result = await collection.insertOne(user);
  res.send(result).status(201);
});

module.exports = router;
