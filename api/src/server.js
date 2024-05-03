const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { connectDb } = require("./modules/database");
const { authRouter } = require("./modules/auth");
const { errorHandler } = require("./middleware");

// Creates an Express application
const app = express();
const PORT = process.env.PORT || 9000;

// Uses the middleware that only parses JSON and expects requests with
// the Content-Type header set to a respective value.
app.use(bodyParser.json());
// Uses middleware for handling the Cross-Origin Resource Sharing requests.
app.use(cors());
app.use(cookieParser());

app.use("/auth", authRouter);

// IMPORTANT: this middleware must be the last among all app.use() and route calls
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDb();

    app.listen(PORT, () => {
      console.log(`The server is listening on port ${PORT}`);
    });
  } catch (e) {
    console.error("Unable to start the server: ", e);
  }
};

module.exports = { startServer };
