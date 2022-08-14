const mostBlogs = require('../utils/list_helper').mostBlogs 
const blogs = require('./blogs')

describe('most blogs', () => {
    test('of empty list is empty object', () => {
      expect(mostBlogs([])).toEqual({})
    })
  
    test('has author by name robert c. martin with 3 blogs', () => {
      const expectedObject  = {
        author: "Robert C. Martin",
        blogs: 3
      }  
      expect(mostBlogs(blogs)).toEqual(expectedObject)
    })
  
  })