const { Order } = require("../models/order");
const express = require("express");
const { OrderItem } = require("../models/order-items");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const orderList = await Order.find();

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});

router.post(`/`, async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderitem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderitem = await newOrderitem.save();

      return newOrderitem._id;
    })
  );

  const orderItemsIdsResolved = await orderItemsIds;

  let order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: req.body.totalPrice,
    user: req.body.user,
    dateOrdered: req.body.dateOrdered,
  });

  order = await order.save();
  if (!order) return res.status(400).send("The order cannot be created");
  res.send(order);
  // order
  //   .save()
  //   .then((createdOrder) => {
  //     res.status(201).json(createdOrder);
  //   })
  //   .catch((err) => {
  //     res.status(500).json({
  //       error: err,
  //       success: false,
  //     });
  //   });
});

module.exports = router;
