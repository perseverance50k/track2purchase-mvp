const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Creates an Express application
const app = express();
const PORT = process.env.PORT || 9000;

// Uses the middleware that only parses JSON and expects requests with
// the Content-Type header set to a respective value.
app.use(bodyParser.json());
// Uses middleware for handling the Cross-Origin Resource Sharing requests.
app.use(cors());

app.get("/", (_req, res) => {
  res.send("Hello from Track2Purchase!:)");
});

app.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT}`);
});
