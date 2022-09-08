const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { tokenExtractor, userExtractor } = require("./../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { blogs: 0 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(400).json({ error: "blog not found" });
  }
  response.json(blog);
});

//api/blogs/:id/comments
blogsRouter.post(
  "/:id/comments",
  tokenExtractor,
  userExtractor,
  async (request, response) => {
    console.log("bbbbbbbbbb 1");
    const user = request.user;
    if (!user.id) {
      return response.status(400).json({ error: "invalid token" });
    }
    console.log("bbbbbbbbbb 2");
    const existingUser = await User.findById(user.id);
    if (!existingUser.id) {
      return response
        .status(400)
        .json({ error: "user not found from database" });
    }

    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(400).json({ error: "blog not found" });
    }
    blog.comments = blog.comments.concat(request.body.comment);
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  }
);

blogsRouter.post(
  "/",
  tokenExtractor,
  userExtractor,
  async (request, response) => {
    const user = request.user;
    if (!user.id) {
      return response.status(400).json({ error: "invalid token" });
    }

    const existingUser = await User.findById(user.id);
    if (!existingUser.id) {
      return response
        .status(400)
        .json({ error: "user not found from database" });
    }

    if (!request.body.title || !request.body.url) {
      return response.status(400).json({ error: "title or url are required" });
    }

    const blog = new Blog({
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes,
      user: existingUser._id,
      comments: request.body.comments,
    });

    const savedBlog = await blog.save();
    existingUser.blogs = existingUser.blogs.concat(savedBlog._id);

    await existingUser.save();
    response.status(201).json(savedBlog);
  }
);

blogsRouter.delete(
  "/:id",
  tokenExtractor,
  userExtractor,
  async (request, response) => {
    const user = request.user;
    if (!user.id) {
      return response.status(400).json({ error: "invalid token" });
    }

    const existingUser = await User.findById(user.id);
    if (!existingUser.id) {
      return response
        .status(400)
        .json({ error: "user not found from database" });
    }
    const blog = await Blog.findOne({ user: existingUser._id });
    if (!blog) {
      return response.status(401).json({
        error: "deletion can be only performed by user who created the blog",
      });
    }

    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  }
);

blogsRouter.put(
  "/:id",
  tokenExtractor,
  userExtractor,
  async (request, response) => {
    const user = request.user;
    if (!user.id) {
      return response.status(400).json({ error: "invalid token" });
    }
    const existingUser = await User.findById(user.id);
    if (!existingUser.id) {
      return response
        .status(400)
        .json({ error: "user not found from database" });
    }
    const { likes } = request.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { likes },
      { new: true, runValidators: true, context: "query" }
    );

    return response.json(updatedBlog);
  }
);

module.exports = blogsRouter;
