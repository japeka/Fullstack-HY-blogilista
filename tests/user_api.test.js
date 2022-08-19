const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('user creation tests', () => {
    beforeEach(async () => {
      await User.deleteMany({})
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
      await user.save()
    })
  
    describe('user creation success', () => {
        test('creation succeeds with a valid username, password, long enough username', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: 'jaakob200',
            name: 'Jaakob N2',
            password: 'salainen',
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
        })
    })
  })
  
  describe('user creation failure', () => {
    test('creation fails due to username missing', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = {
        username: '',
        name: 'Superuser',
        password: 'salainen',
      }
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      expect(result.body.error).toContain('username, password must not be empty, username must contain at least 3 characters')
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails due to usernames length is less than 3', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
          username: 'jk',
          name: 'Superuser',
          password: 'salainen',
        }
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
        expect(result.body.error).toContain('username, password must not be empty, username must contain at least 3 characters')
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      })

      test('creation fails due to password missing', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
          username: 'jk10001',
          name: 'Superuser',
        }
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
        expect(result.body.error).toContain('username, password must not be empty, username must contain at least 3 characters')
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      })
  
      test('creation fails due to user being not unique', async () => {
        const usersAtStart = await helper.usersInDb()
        const existingUserName = usersAtStart[0].username

        const newUser = {
          username: existingUserName,
          name: 'Superuser',
          password: 'salainen'
        }

        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
        expect(result.body.error).toContain('username must be unique')
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      })
    })


  afterAll(() => {
      mongoose.connection.close()
  })