const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
require('express-async-errors')
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const {requestLogger,unknownEndpoint,errorHandler } = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    if(process.env.NODE_ENV !== 'test') {
      console.log('connected to MongoDB')
    }
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })


app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))  
app.use(bodyParser.json())

app.use(requestLogger)

//tokenExtractor,userExtractor not included here because we want to keep route of /api/blogs tokenless and userless
app.use('/api/blogs', blogsRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app