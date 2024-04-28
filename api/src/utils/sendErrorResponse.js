const sendErrorResponse = (res, message, statusCode) => {
  res.send({ error: message }).status(statusCode);
};

module.exports = {
  sendErrorResponse,
};
