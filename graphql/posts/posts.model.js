const axios = require("axios");

const getAllPosts = async () => {
  const { data } = await axios.get(
    "https://jsonplaceholder.typicode.com/posts"
  );
  return data;
};

module.exports = { getAllPosts };
