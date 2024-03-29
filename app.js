// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path'); 


const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/MajorProject', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);


const protectedRoutes = require('./routes/protected');
app.use('/api', protectedRoutes);

// Route to serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Fetch account balance
app.get('/balance', async (req, res) => {
  try {
    // Fetch balance from MongoDB (replace this with actual logic)
    const user = await User.findOne({ username: req.query.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ balance: user.balance });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Send money
app.post('/send-money', async (req, res) => {
  try {
    const { receiverUsername, amount } = req.body;
    // Logic to send money (replace this with actual logic)
    // For example:
    const sender = await User.findOne({ username: req.body.senderUsername });
    const receiver = await User.findOne({ username: receiverUsername });
    if (!sender || !receiver) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (sender.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    sender.balance -= amount;
    receiver.balance += amount;
    await sender.save();
    await receiver.save();
    res.send('Money sent successfully');
  } catch (error) {
    console.error('Error sending money:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

