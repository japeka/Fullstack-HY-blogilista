const mostLikes = require('../utils/list_helper').mostLikes 
const blogs = require('./blogs')

describe('most likes', () => {
    test('of empty list is empty object', () => {
      expect(mostLikes([])).toEqual({})
    })
    
    test('is expected to be author Edsger W. Dijkstra with 17 likes', () => {
      const expectedObject  = {
        author: "Edsger W. Dijkstra",
        likes: 17
      }  
      expect(mostLikes(blogs)).toEqual(expectedObject)
    })
  })