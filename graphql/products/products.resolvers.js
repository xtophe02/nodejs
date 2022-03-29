const {
  getAllProducts,
  getProductByPrice,
  getProductById,
  postProductReview,
} = require("./products.model.js");

module.exports = {
  Query: {
    products: () => getAllProducts(),
    productsByPrice: (_, { minPrice, maxPrice }) =>
      getProductByPrice(minPrice, maxPrice),
    productById: (_, { id }) => getProductById(id),
  },
  Mutation: {
    addNewProductReview: (_, args) => postProductReview(args),
  },
};
