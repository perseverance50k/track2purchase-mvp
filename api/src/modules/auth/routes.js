const express = require("express");
const bcrypt = require("bcrypt");

const { getCollection } = require("../database");
const {
  login: loginValidationSchema,
  registration: registrationValidationSchema,
} = require("./validation");

const router = express.Router();

const USERS_COLLECTION = "users";
const SALT_ROUNDS = +process.env.SALT_ROUNDS || 10;

// --- REGISTRATION ---
router.post("/register", async (req, res, next) => {
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

  try {
    const isUserExist = await collection.findOne({ email: credentials.email });

    if (isUserExist) {
      const payload = {
        error: "Such a user already exist!",
      };

      res.send(payload).status(403);
      return;
    }

    bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
      if (err) {
        console.err(err);

        const payload = {
          error: "Error occurred while creating a user!",
        };

        res.send(payload).status(500);
        return;
      }

      bcrypt.hash(credentials.password, salt, async (err, hash) => {
        if (err) {
          console.err(err);

          const payload = {
            error: "Error occurred while creating a user!",
          };

          res.send(payload).status(500);
          return;
        }

        const userWithHashedPassword = {
          ...credentials,
          password: hash,
        };

        const result = await collection.insertOne(userWithHashedPassword);
        res.send(result).status(201);
      });
    });
  } catch (e) {
    next(e);
  }
});

// --- LOGIN ---
router.post("/login", async (req, res, next) => {
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

  try {
    const user = await collection.findOne({ email });

    if (!user) {
      const payload = {
        error: "Incorrect credentials provided!",
      };

      res.send(payload).status(403);
      return;
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        const payload = {
          error: "Error occurred while authenticating a user!",
        };

        res.send(payload).status(500);
      }

      if (result) {
        const payload = {
          success: "Successfully logged in!",
        };

        res.send(payload).status(200);
      } else {
        const payload = {
          error: "Incorrect credentials provided!",
        };

        res.send(payload).status(403);
      }
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
