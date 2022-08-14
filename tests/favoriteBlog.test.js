const favoriteBlog = require('../utils/list_helper').favoriteBlog 
const blogs = require('./blogs')

describe('favorite blog', () => {
    test('of empty list equals empty object', () => {
      expect(favoriteBlog([])).toEqual({})
    })
    
    test('of all blogs has 12 likes', () => {
        const expectedBlog = {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12
          }        
      expect(favoriteBlog(blogs)).toEqual(expectedBlog)
    })
  })