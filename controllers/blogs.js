const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt  = require('jsonwebtoken')
const { tokenExtractor, userExtractor } = require('./../utils/middleware')

/*tokenless & userless free route */ 
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
      .populate('user', { blogs: 0 })
    response.json(blogs)
})
  
/*token & user info required */ 
blogsRouter.post('/', tokenExtractor, userExtractor, async (request, response) => {
    const user = request.user
    if(!user.id) {
      response.status(400).json({error: 'invalid token'})  
    }

    const existingUser = await User.findById(user.id)
    if(!existingUser.id) {
      response.status(400).json({error: 'user not found from database'})  
    }

    if(!request.body.title || !request.body.url) {
      response.status(400).json({error: 'title or url are required'})  
    } 

    const blog = new Blog({
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes,
      user: existingUser._id
    })

    const savedBlog = await blog.save()
    existingUser.blogs = existingUser.blogs.concat(savedBlog._id)

    await existingUser.save()
    response.status(201).json(savedBlog)
})

/*token & user info required */ 
blogsRouter.delete('/:id', tokenExtractor, userExtractor, async (request, response) => {
  const user = request.user
  if(!user.id) {
    response.status(400).json({error: 'invalid token'})  
  }

  const existingUser = await User.findById(user.id)
  if(!existingUser.id) {
    response.status(400).json({error: 'user not found from database'})  
  }
  const blog = await Blog.findOne({user: existingUser._id})
  if(!blog) {
    return response.status(401).json({ error: 'deletion can be only performed by user who created the blog' })
  }
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', tokenExtractor, userExtractor, async (request, response) => {
  const user = request.user
  if(!user.id) {
    response.status(400).json({error: 'invalid token'})  
  }
  const existingUser = await User.findById(user.id)
  if(!existingUser.id) {
    response.status(400).json({error: 'user not found from database'})  
  }

  const { likes } = request.body
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    {likes},
    { new: true, runValidators: true, context: 'query' }
  )
  response.json(updatedBlog)
})

module.exports = blogsRouter
  