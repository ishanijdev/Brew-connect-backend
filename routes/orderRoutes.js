const express = require('express');
const { protect } = require('../middleware/authMiddleware.js');
const Order = require('../models/orderModel.js');
const User = require('../models/userModel.js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  // Create order with isPaid: false by default
  const order = new Order({
    orderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    totalPrice,
  });

  const createdOrder = await order.save();

  // If payment method is Card, create a payment intent for it
  if (paymentMethod === 'Card') {
    const amountInCents = Math.round(totalPrice * 100);
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'inr', // Or aud, usd, etc.
        payment_method_types: ['card'],
        metadata: { orderId: createdOrder._id.toString() },
      });
      createdOrder.paymentIntentId = paymentIntent.id;
      await createdOrder.save();
      res.status(201).json({ createdOrder, clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).json({ message: 'Stripe Error: ' + error.message });
    }
  } else {
    // For Cash on Delivery, mark as paid immediately and clear cart
    createdOrder.isPaid = true;
    createdOrder.paidAt = Date.now();
    await createdOrder.save();
    
    const user = await User.findById(req.user._id);
    if (user) {
      user.cartItems = [];
      await user.save();
    }
    res.status(201).json({ createdOrder });
  }
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});

module.exports = router;