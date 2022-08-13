/* eslint-disable no-undef */
const mongoose = require('mongoose')
if (process.argv.length < 3) {
  console.log('give password as argument')
  // eslint-disable-next-line no-undef
  process.exit(1)
}

// eslint-disable-next-line no-undef
//blogApp
const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.2ux4a.mongodb.net/blogApp?retryWrites=true&w=majority`

//mongoose.connect(url)
//config.MONGODB_URI
mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })


const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
  })
  
const Blog = mongoose.model('Blog', blogSchema)

Blog.find({}).then(result => {
  result.forEach(blog => {
    console.log(blog)
  })
  mongoose.connection.close()
})

// const blog = new Blog({
//     title: "second blog",
//     author: "arik",
//     url: "http://abc123.com",
//     likes: 1
// })

// blog.save().then((result) => {
//   console.log('blog saved!', result)
//   mongoose.connection.close()
// })

//   const noteSchema = new mongoose.Schema({
//     content: String,
//     date: Date,
//     important: Boolean,
//   })
