const { getAllPosts } = require("./posts.model.js");

module.exports = {
  Query: {
    posts: async () => await getAllPosts(),
  },
};
