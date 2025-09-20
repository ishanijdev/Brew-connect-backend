const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db.js');
const productRoutes = require('./routes/productRoutes.js');
const userRoutes = require('./routes/userRoutes.js'); // 1. IMPORT USER ROUTES
const cors = require('cors');

dotenv.config();

const cartRoutes = require('./routes/cartRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const Order = require('./models/orderModel.js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('./models/userModel.js');

connectDB();

const app = express();

app.use(cors());
app.post('/api/stripe-webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    console.log('✅ PaymentIntent was successful!');
    
    // Find the order using the metadata we stored
    const order = await Order.findOne({ paymentIntentId: paymentIntent.id });
    if (order && !order.isPaid) {
        order.isPaid = true;
        order.paidAt = Date.now();
        await order.save();
        console.log(`Order ${order._id} has been marked as paid.`);

        // Now that payment is confirmed, clear the user's cart
        const user = await User.findById(order.user);
        if (user) {
            user.cartItems = [];
            await user.save();
            console.log(`Cart cleared for user ${user._id}.`);
        }
    }
  }

  res.json({received: true});
});
app.use(express.json()); // 2. ADD THIS MIDDLEWARE TO ACCEPT JSON DATA

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Route to get the Stripe publishable key
app.get('/api/config/stripe', (req, res) => {
  res.send({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes); // 3. USE USER ROUTES
app.use('/api/cart', cartRoutes); 
app.use('/api/orders', orderRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});