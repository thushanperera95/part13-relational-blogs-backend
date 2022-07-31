const express = require('express')
require('express-async-errors')

const app = express()

const { PORT } = require('./src/util/config')
const { connectToDatabase } = require('./src/util/db')

const blogsRouter = require('./src/controllers/blogs')
const usersRouter = require('./src/controllers/users')
const loginRouter = require('./src/controllers/login')
const logoutRouter = require('./src/controllers/logout')
const authorsRouter = require('./src/controllers/authors')
const readingListsRouter = require('./src/controllers/readingLists')

const { errorHandler } = require('./src/middlewares/errorHandler')
const { unknownEndpoint } = require('./src/middlewares/unknownEndpointHandler')

app.use(express.json())

app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readingLists', readingListsRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()