const errorHandler = (error, request, response, next) => {
  console.log(error.name)
  console.log(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: error.message })
  }
  else if (error.name === 'SequelizeValidationError') {
    return response.status(400).send({ error: error.message })
  }
  else if (error.name === 'NotAuthorizedError') {
    return response.status(401).send({ error: error.message })
  }
  else {
    next(error)
  }
}

module.exports = { errorHandler }