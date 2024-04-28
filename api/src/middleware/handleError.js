const errorHandler = (err, _req, res, _next) => {
  console.error(err);

  const payload = {
    error: "Something broke on the server!",
  };

  res.send(payload).status(500);
};

module.exports = { errorHandler };
