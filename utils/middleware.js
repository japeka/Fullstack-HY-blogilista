const jwt  = require('jsonwebtoken')
const logger = require('./logger')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).send({ error: 'invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).send({ error: 'token expired' })
  }
  next(error)
}
const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
  next()
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.headers.authorization
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request['token'] = authorization.substring(7)
  }
  next()
}

const userExtractor =  (request, response, next) => {
  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET) 
  if (token && decodedToken.id) {
    request['user'] = decodedToken
  }
  next()
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  requestLogger,
  tokenExtractor,
  userExtractor
}
