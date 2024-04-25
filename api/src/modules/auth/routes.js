const express = require("express");

const { getCollection } = require("../database");
const {
  login: loginValidationSchema,
  registration: registrationValidationSchema,
} = require("./validation");

const router = express.Router();

const USERS_COLLECTION = "users";

router.post("/register", async (req, res) => {
  const credentials = req.body;
  const collection = getCollection(USERS_COLLECTION);

  const validationResult = registrationValidationSchema.validate(credentials);

  if (validationResult.error) {
    const payload = {
      error: "Incorrect credentials provided!",
    };

    res.send(payload).status(400);
    return;
  }

  const isUserExist = await collection.findOne({ email: credentials.email });

  if (isUserExist) {
    const payload = {
      error: "Such a user already exist!",
    };

    res.send(payload).status(403);
    return;
  }

  const result = await collection.insertOne(credentials);
  res.send(result).status(201);
});

router.post("/login", async (req, res) => {
  const credentials = req.body;
  const collection = getCollection(USERS_COLLECTION);

  const validationResult = loginValidationSchema.validate(credentials);

  if (validationResult.error) {
    const payload = {
      error: "Incorrect credentials provided!",
    };

    res.send(payload).status(400);
    return;
  }

  const { email, password } = credentials;
  const user = await collection.findOne({ email });

  if (!user || user.password !== password) {
    const payload = {
      error: "Incorrect credentials provided!",
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
