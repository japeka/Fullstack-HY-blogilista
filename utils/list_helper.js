const _ = require("lodash")
const dummy = blogs => 1
const totalLikes = blogs => blogs.reduce((sum, item) => {return sum + Number(item.likes)}, 0)
const favoriteBlog = blogs => blogs.length===0 ? {} : blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current)

const mostBlogs = blogs => {
    if(blogs.length === 0) return {}
    blogs = _.groupBy(blogs, 'author')
    keys = Object.keys(blogs)
    values = Object.values(blogs)
    let count = 0, name = ''
    for (var i = 0; i < keys.length; i++) {
        if(values[i].length > count) {
            count = values[i].length
            name = keys[i]
        }
    }
    return {author: name, blogs: count}
}

const mostLikes = blogs => {
    if(blogs.length === 0) return {}
    blogs = _.groupBy(blogs, 'author')
    keys = Object.keys(blogs)
    values = Object.values(blogs)
    let name = '', likes = 0
    for (var i = 0; i < keys.length; i++) {
        let _likes = values[i].reduce((sum, item) => {return sum + Number(item.likes)}, 0)
        if(_likes > likes){
            name = keys[i]
            likes = _likes
        }
    }
    return {author: name, likes}
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}