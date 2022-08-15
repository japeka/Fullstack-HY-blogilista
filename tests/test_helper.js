const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'first blog',
    author: 'andy warfork',
    url: 'http://abc123.com',
    likes: 1
  },
  {
    title: 'second blog',
    author: 'carl perkings',
    url: 'http://carl.com',
    likes: 5
  }
]

// const nonExistingId = async () => {
//   const note = new Note({ content: 'willremovethissoon', date: new Date() })
//   await note.save()
//   await note.remove()

//   return note._id.toString()
// }

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs
    //nonExistingId
    ,blogsInDb
}