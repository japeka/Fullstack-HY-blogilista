require('dotenv').config()

let PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_UR

module.exports = {
  MONGODB_URI,
  PORT
}