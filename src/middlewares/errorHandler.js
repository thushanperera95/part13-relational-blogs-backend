const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: error.message })
  } else {
    next(error)
  }
}

module.exports = { errorHandler }