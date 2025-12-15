const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');


dotenv.config();


const connectDB = require('./src/config/db');


const categoryRoutes = require('./src/routes/category.routes');
const groupRoutes = require('./src/routes/group.routes');
const unitRoutes = require('./src/routes/unit.routes');


const userRoutes = require('./src/routes/user.route'); 


connectDB();

const app = express();


app.use(cors());
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));


app.use('/api/categories', categoryRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/groups', groupRoutes);

app.use('/it4788/user', userRoutes); 

app.get('/', (req, res) => res.send('API Đi Chợ Tiện Lợi đang chạy...'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server đang chạy trên cổng ${PORT}`));