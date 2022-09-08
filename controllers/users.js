const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", { likes: 0, user: 0 });
  response.json(users);
});

usersRouter.get("/:id", async (request, response) => {
  const id = request.params.id;
  const existingUser = await User.findById(id).populate("blogs", {
    likes: 0,
    user: 0,
  });
  console.log("existingUser", existingUser);

  if (!existingUser) {
    return response.status(400).json({
      error: "user was not found",
    });
  }
  response.json(existingUser);
});

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;
  if (!(username && password && username.length >= 3)) {
    return response.status(400).json({
      error:
        "username, password must not be empty, username must contain at least 3 characters",
    });
  }
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(400).json({
      error: "username must be unique",
    });
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

module.exports = usersRouter;
