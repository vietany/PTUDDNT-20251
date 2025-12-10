const express = require('express');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Sửa đường dẫn: Thêm ./src/
const connectDB = require('./src/config/db');

// Sửa đường dẫn: Thêm ./src/
const categoryRoutes = require('./src/routes/category.routes');
const unitRoutes = require('./src/routes/unit.routes');

// Kiểm tra xem file này bạn đã tạo chưa, nếu chưa thì comment lại nhé
// const userRoutes = require('./src/routes/user.route'); 

// Kết nối DB
connectDB();

const app = express();

// Middleware
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/units', unitRoutes);

// app.use('/it4788/user', userRoutes); // Bật lại khi đã có file user route

app.get('/', (req, res) => res.send('API Đi Chợ Tiện Lợi đang chạy...'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server đang chạy trên cổng ${PORT}`));