const bcrypt = require("bcrypt");

const {
  login: loginValidationSchema,
  registration: registrationValidationSchema,
} = require("./validation");

const { getCollection } = require("../database");

const USERS_COLLECTION = "users";
const SALT_ROUNDS = +process.env.SALT_ROUNDS || 10;

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

      collection.insertOne(userWithHashedPassword);
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

    if (!result) {
      throw new Error("Incorrect credentials provided!");
    }
  });

  delete user.password;
  delete user._id;

  return user;
};

module.exports = {
  add,
  verify,
};
