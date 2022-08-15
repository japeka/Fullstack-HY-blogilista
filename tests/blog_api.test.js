const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

describe('various blogs related tests', () => {
    beforeEach(async () => {
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
    test('a valid blog can be added', async () => {
        const newBlog = {
        title: 'random blog abc',
        author: 'eddie harlin',
        url: 'http://harlin.com',
        likes: 1
        }
        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
        const contents = blogsAtEnd.map(n => n.title)
        expect(contents).toContain('random blog abc')
    })
    test('a blog is added with no likes value, test if default value is set to zero', async () => {
        const newBlog = {
        title: 'random2 blog2 abc2',
        author: 'eddie2 harlin2',
        url: 'http://harlin2.com'
        }
        const savedBlog = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
        expect(savedBlog.body.likes).toEqual(0)
    })
    test('a blog is added with no title and url values, server should respond with error code 400', async () => {
        const newBlog = {
        url: 'http://harlin3.com',likes: 3
        }
        const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })
  })  
  describe('deletion of a blob', () => {
    test('a blog can be deleted', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
    
        await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
    
        const blogsAtEnd = await helper.blogsInDb()
    
        expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
        )
        const contents = blogsAtEnd.map(r => r.title)
        expect(contents).not.toContain(blogToDelete.title)
    })
  })  
  describe('update of a blobs likes', () => {
   test('a blogs likes can be updated, change 1 like to 99 likes', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]  
    const newUpdateBlog = {...blogToUpdate, likes: 99}
    const updated = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newUpdateBlog)
      .expect(200)
    const expected = {id: newUpdateBlog.id, likes: newUpdateBlog.likes}
    expect(newUpdateBlog.likes).toBe(updated.body.likes)
   })
  })  
}) 

afterAll(() => {
    mongoose.connection.close()
})