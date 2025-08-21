const express = require('express');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./db'); 
const cors = require('cors');
const app = express();
const PORT =process.env.PORT || 3000;

app.use(express.json());
app.use(cors())
app.get('/', (req, res) => {
    res.send('Server is running!');
});
app.use('/api/auth', authRoutes);
connectDB();
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});