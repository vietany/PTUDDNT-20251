const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Load env vars
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));

// Import Routes
const userRoutes = require('./src/routes/user.route');
const categoryRoutes = require('./src/routes/category.routes');
const groupRoutes = require('./src/routes/group.routes');
const foodRoutes = require('./src/routes/food.routes');
const fridgeRoutes = require('./src/routes/fridge.routes');
const shoppingRoutes = require('./src/routes/shopping.routes');
const mealRoutes = require('./src/routes/meal.routes');
const recipeRoutes = require('./src/routes/recipe.routes');
const reportRoutes = require('./src/routes/report.routes');

// === ĐƯỜNG DẪN CHUẨN IT4788 ===
app.use('/it4788/user', userRoutes);
app.use('/it4788/category', categoryRoutes);
app.use('/it4788/group', groupRoutes);
app.use('/it4788/food', foodRoutes);
app.use('/it4788/fridge', fridgeRoutes);
app.use('/it4788/shopping', shoppingRoutes);
app.use('/it4788/meal', mealRoutes);
app.use('/it4788/recipe', recipeRoutes);
app.use('/it4788/report', reportRoutes);

app.get('/', (req, res) => res.send('API Đi Chợ Tiện Lợi (IT4788) Full Features Ready!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server chạy tại cổng ${PORT}`));
