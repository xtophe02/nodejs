const products = [
  {
    id: "1",
    description: "Red Shoe",
    price: 42.12,
    reviews: [
      { rating: 2, comment: "Nice show" },
      { rating: 3, comment: "whoah" },
    ],
  },
  {
    id: "2",
    description: "Blue Shoe",
    price: 82.99,
    reviews: [
      { rating: 5, comment: "Nice show" },
      { rating: 5, comment: "whoah" },
    ],
  },
  {
    id: "3",
    description: "Green Shoe",
    price: 2.59,
    reviews: [],
  },
];

function getAllProducts() {
  return products;
}
function getProductByPrice(min, max) {
  return products.filter((p) => p.price >= min && p.price <= max);
}
function getProductById(id) {
  return products.find((p) => p.id === id);
}

function postProductReview(product) {
  return products.find((p) => {
    if (p.id === product.id) {
      p.reviews.push({ rating: product.rating, comment: product.comment });
      // console.log(p);
      return p;
    }
  });
}

module.exports = {
  getAllProducts,
  getProductByPrice,
  getProductById,
  postProductReview,
};
