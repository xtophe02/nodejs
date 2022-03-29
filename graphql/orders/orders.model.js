const orders = [
  {
    date: "2020-05-05",
    subtotal: 90.22,
    items: [
      {
        product: {
          id: "2",
        },
        quantity: 2,
      },
    ],
  },
];

function getAllOrders() {
  return orders;
}
module.exports = {
  getAllOrders,
};
