const { favoriteBlog, totalLikes, mostBlogs, mostLikes } = require("../utils/list_helper");
const blogs = require("./blogs_helper");

describe("preliminary blog tests", () => {

describe("favorite blog", () => {
  test("of all blogs has 12 likes", () => {
    const expectedBlog = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    }
    expect(favoriteBlog(blogs)).toEqual(expectedBlog)
  })
})

describe("total likes", () => {
  test("of a bigger list is calculated right", () => {
    expect(totalLikes(blogs)).toBe(36)
  })
})

describe("most blogs", () => {
  test("has author by name robert c. martin with 3 blogs", () => {
    const expectedObject = {
      author: "Robert C. Martin",
      blogs: 3,
    }
    expect(mostBlogs(blogs)).toEqual(expectedObject)
  })
})

describe('most likes', () => {
    test('is expected to be author Edsger W. Dijkstra with 17 likes', () => {
      const expectedObject  = {
        author: "Edsger W. Dijkstra",
        likes: 17
      }  
      expect(mostLikes(blogs)).toEqual(expectedObject)
    })
})
})