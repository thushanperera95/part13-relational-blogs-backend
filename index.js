const express = require('express')
require('express-async-errors')

const app = express()

const { PORT } = require('./src/util/config')
const { connectToDatabase } = require('./src/util/db')

const blogsRouter = require('./src/controllers/blogs')
const { errorHandler } = require('./src/middlewares/errorHandler')
const { unknownEndpoint } = require('./src/middlewares/unknownEndpointHandler')

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use(unknownEndpoint)
app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()