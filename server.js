const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto')
const app = express();


// middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
// MongoDB connect
mongoose.connect('mongodb://127.0.0.1:27017/ayeluxe')

.then(() => console.log("MongoDB connected ✅"))
.catch(err => console.log(err));


// ================= MODEL =================
const User = mongoose.model('User', {
  name: String,
  phone: String,
  address: String,
  pincode: String,
  city: String,
  state: String,
  product: String,
  price: String,
  quantity: String,
  image: String,
  status: String
});


// ================= TEST =================
app.get('/', (req, res) => {
  res.send("Server running 🚀");
});


// ================= SAVE ORDER =================
app.post('/order', async (req, res) => {
  try {

    const order = new User({
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      pincode: req.body.pincode,
      city: req.body.city,
      state: req.body.state,
      product: req.body.product,
      price: req.body.price,
      quantity: req.body.quantity || 1,

      image: req.body.image,   // ✅ IMPORTANT
      status: "Pending"
    });

    await order.save();

    res.json({
      message: "Order saved successfully",
      orderId: order._id
    });

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});



app.get('/all-orders', async (req, res) => {
  try {
    const orders = await User.find().sort({ _id: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});


// ================= UPDATE STATUS =================
app.put('/update-order/:id', async (req, res) => {
  try {
    const { status } = req.body;

    await User.findByIdAndUpdate(req.params.id, { status });

    res.json({ message: "Status updated ✅" });

  } catch (err) {
    res.status(500).json({ message: "Update failed ❌" });
  }
});


// line ~83
app.put("/update-order/:id", async (req, res) => {
  
})

// 👇 LINE ~95 (YAHAN ADD KARNA HAI)
app.delete("/delete-order/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await User.findByIdAndDelete(id);

    res.json({ message: "Order deleted ✅" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed ❌" });
  }
})




// ================= START SERVER =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});