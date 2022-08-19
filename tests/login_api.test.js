const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('user login tests', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('salainen', 10)
        const user = new User({ username: 'jannek100', passwordHash })
        await user.save()
    })

    describe('user logs in succesfully', () => {
        test('operation succeeds and gets a token', async () => {
        const user = {
          username: 'jannek100',
          password: 'salainen',
        }

        const person = await api
            .post('/api/login')
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/)

            const {token,username} = person.body
            expect(token).not.toBeNull() 
            expect(username).not.toBeNull() 
        })
    })
  })
  
  describe('user logs in unsuccesfully', () => {
    test('operation fails due to non existing username', async () => {
      const user= {
        username: 'flohfjos',
        name: 'Superuser',
        password: 'salainen',
      }
      const result = await api
        .post('/api/login')
        .send(user)
        .expect(401)
        .expect('Content-Type', /application\/json/)
      expect(result.body.error).toContain('invalid username or password')
    })
})

afterAll(() => {
    mongoose.connection.close()
})