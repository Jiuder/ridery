function returnObject(error, message, code) {
  return {
    error,
    message,
    code,
  };
}

module.exports = returnObject;
