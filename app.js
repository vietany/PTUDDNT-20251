const express = require('express');
const connectDB = require('./src/config/db');
require('dotenv').config();

const userRoutes = require('./src/routes/user.route');

connectDB();

const app = express();

app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));

app.use('/it4788/user', userRoutes);

app.get('/', (req, res) => res.send('API Đang chạy...'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server đang chạy trên cổng ${PORT}`));
