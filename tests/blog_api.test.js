const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

describe('various blogs related tests', () => {
    beforeEach(async () => {
      await User.deleteMany({})
      await Blog.deleteMany({})
      await Blog.insertMany(helper.initialBlogs)
  })
   test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
  })
   test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body).toHaveLength(helper.initialBlogs.length)
   })  

  test('all blogs should contain id as identifier', async () => {
        const response = await api.get('/api/blogs').expect(200)
        response.body.map(r => expect(r.id).toBeDefined())
  })  

  describe('adding blobs', () => {
     test('a valid blog can be added by user who gets assigned a token', async () => {

      const user = await helper.getUser()
      expect(user.username).not.toBeNull()
      const person = await api
          .post('/api/login')
          .send(user)
          .expect(200)
          .expect('Content-Type', /application\/json/)

      const {token,username} = person.body
      expect(token).not.toBeNull() 
      expect(username).not.toBeNull() 

      const newBlog = {
        title: 'random blog abcdt',
        author: 'eddie harlin123',
        url: 'http://harlin123.com',
        likes: 1
        }

      const blogsAtStart = await helper.blogsInDb()
      const savedBlog = await api
        .post('/api/blogs')
        .send(newBlog)
        .set({'Content-Type':'application/json', 'Authorization': `bearer ${token}`}) 
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd.length).toBe(blogsAtStart.length + 1)
    })

    test('a valid blog can not be added by user whose token is invalid', async () => {
      const user = await helper.getUser()
      expect(user.username).not.toBeNull()
      const person = await api
          .post('/api/login')
          .send(user)
          .expect(200)
          .expect('Content-Type', /application\/json/)

      const {token,username} = person.body
      expect(token).not.toBeNull() 
      expect(username).not.toBeNull() 

      const newBlog = {
        title: 'random blog abcdtfac',
        author: 'eddie harlin123',
        url: 'http://harlin123.com',
        likes: 1
        }

      const blogsAtStart = await helper.blogsInDb()
      const savedBlog = await api
        .post('/api/blogs')
        .send(newBlog)
        .set({'Content-Type':'application/json', 'Authorization': `bearer ${token}1`}) 
        .expect(401)
        .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd.length).toBe(blogsAtStart.length)
    })

    test('a blog is added with no likes value, test if default value is set to zero', async () => {
        const user = await helper.getUser()
        expect(user.username).not.toBeNull()
        const person = await api
            .post('/api/login')
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const {token,username} = person.body
        expect(token).not.toBeNull() 
        expect(username).not.toBeNull() 

        const newBlog = {
          title: 'random2 blog2 abc2',
          author: 'eddie2 harlin2',
          url: 'http://harlin2.com'
        }

        const savedBlog = await api
          .post('/api/blogs')
          .send(newBlog)
          .set({'Content-Type':'application/json', 'Authorization': `bearer ${token}`}) 
          .expect(201)
          .expect('Content-Type', /application\/json/)
        expect(savedBlog.body.likes).toEqual(0)
    })

    test('a blog is added with no title and url values, server should respond with error code 400', async () => {

        const user = await helper.getUser()
        expect(user.username).not.toBeNull()
        const person = await api
            .post('/api/login')
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const {token,username} = person.body
        expect(token).not.toBeNull() 
        expect(username).not.toBeNull() 

        const newBlog = {
          url: 'http://harlin3.com',likes: 3
        }

        const response = await api
          .post('/api/blogs')
          .send(newBlog)
          .set({'Content-Type':'application/json', 'Authorization': `bearer ${token}`}) 
          .expect(400)
          .expect('Content-Type', /application\/json/)
     })
   })
    
  describe('deletion of a blob', () => {
    test('a blog can be deleted', async () => {
        const user = await helper.getUser()
        expect(user.username).not.toBeNull()
        const person = await api
            .post('/api/login')
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const {token,username} = person.body
        expect(token).not.toBeNull() 
        expect(username).not.toBeNull() 
        
        const newBlog = {
          title: 'todelete blog2 abc2',
          author: 'eddie2 harlin2',
          url: 'http://harlin2.com'
        }

        const savedBlog = await api
          .post('/api/blogs')
          .send(newBlog)
          .set({'Content-Type':'application/json', 'Authorization': `bearer ${token}`}) 
          .expect(201)
          .expect('Content-Type', /application\/json/)
        
        await api
          .delete(`/api/blogs/${savedBlog.body.id}`)
          .set({'Content-Type':'application/json', 'Authorization': `bearer ${token}`}) 
          .expect(204)
    })
  })  

  describe('update of a blobs likes', () => {
   test('a blogs likes can be updated, change 1 like to 99 likes', async () => {
    const user = await helper.getUser()
    expect(user.username).not.toBeNull()
    const person = await api
        .post('/api/login')
        .send(user)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const {token,username} = person.body
    expect(token).not.toBeNull() 
    expect(username).not.toBeNull() 

    const newBlog = {
      title: 'toupdate blog2 abc2',
      author: 'eddie2 harlin2update',
      url: 'http://harlin2.com'
    }

    const savedBlog = await api
      .post('/api/blogs')
      .send(newBlog)
      .set({'Content-Type':'application/json', 'Authorization': `bearer ${token}`}) 
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogToUpdate = savedBlog.body  
    const newUpdateBlog = {...blogToUpdate, likes: 99}

    const updated = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set({'Content-Type':'application/json', 'Authorization': `bearer ${token}`}) 
      .send(newUpdateBlog)
      .expect(200)
    expect(newUpdateBlog.likes).toBe(updated.body.likes)
   })
  })

}) 
afterAll(() => {
    mongoose.connection.close()
})