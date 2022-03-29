const { getAllOrders } = require("./orders.model.js");

module.exports = {
  Query: {
    orders: () => getAllOrders(),
  },
};
