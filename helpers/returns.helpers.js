/*
 * Copyright (c) 2021. 
 * Jesus Nuñez <Jesus.nunez2050@gmail.com>
 */

function returnObject(error, message, code) {
  return {
    error: error,
    message: message,
    code: code
  }
}

module.exports = returnObject
