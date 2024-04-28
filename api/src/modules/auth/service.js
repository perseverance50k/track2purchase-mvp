const bcrypt = require("bcrypt");

const {
  login: loginValidationSchema,
  registration: registrationValidationSchema,
} = require("./validation");

const { getCollection } = require("../database");

const add = async (credentials) => {
  const collection = getCollection(USERS_COLLECTION);

  const validationResult = registrationValidationSchema.validate(credentials);

  if (validationResult.error) {
    throw new Error("Incorrect credentials provided!");
  }

  const isUserExist = await collection.findOne({ email: credentials.email });

  if (isUserExist) {
    throw new Error("Incorrect credentials provided!");
  }

  bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
    if (err) {
      throw new Error("Error occurred while creating a user!");
    }

    bcrypt.hash(credentials.password, salt, async (err, hash) => {
      if (err) {
        throw new Error("Error occurred while creating a user!");
      }

      const userWithHashedPassword = {
        ...credentials,
        password: hash,
      };

      return collection.insertOne(userWithHashedPassword);
    });
  });
};

const verify = async (credentials) => {
  const collection = getCollection(USERS_COLLECTION);

  const validationResult = loginValidationSchema.validate(credentials);

  if (validationResult.error) {
    throw new Error("Incorrect credentials provided!");
  }

  const { email, password } = credentials;
  const user = await collection.findOne({ email });

  if (!user) {
    throw new Error("Incorrect credentials provided!");
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      throw new Error("Error occurred while authenticating a user!");
    }

    if (result) {
      delete user.password;
      res.send(user).status(200);
    } else {
      throw new Error("Incorrect credentials provided!");
    }
  });
};

module.exports = {
  add,
  verify,
};
