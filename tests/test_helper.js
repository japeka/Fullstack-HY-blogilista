const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialBlogs = [
  {
    title: 'first blog written',
    author: 'andy warfork',
    url: 'http://abc123.com',
    likes: 1
  },
  {
    title: 'second blog shouted out',
    author: 'carl perkings',
    url: 'http://carl.com',
    likes: 5
  }
]

const initialUser = {
  username: 'jannek100',
  password: 'salainen'
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const getUser = async() => {
  const passwordHash = await bcrypt.hash(initialUser.password, 10)
  const user = new User({ username: initialUser.username, passwordHash })
  const savedUser = await user.save()
  return {
    username: savedUser.username,
    password: initialUser.password
  }
}

module.exports = {
    initialBlogs,
    initialUser,
    blogsInDb,
    usersInDb,
    getUser
}