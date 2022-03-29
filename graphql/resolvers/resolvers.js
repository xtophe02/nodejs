import { orders } from "../orders/orders.model.js";
import { products } from "../products/products.model.js";
import { getAllPosts } from "../posts/posts.model.js";

export const resolvers = {
  Query: {
    products: (parent, args, ctx) => products,
    orders: () => orders,
    posts: async () => await getAllPosts(),
  },
};
