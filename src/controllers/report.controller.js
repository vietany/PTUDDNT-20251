const FridgeItem = require('../models/fridge.model');
const ShoppingList = require('../models/shoppingList.model');
const User = require('../models/user.model');

exports.getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.group) return res.status(400).json({ message: 'Chưa vào nhóm' });

    // 1. Đếm đồ trong tủ
    const fridgeCount = await FridgeItem.countDocuments({ group: user.group });
    
    // 2. Đếm đồ sắp hết hạn (trong 3 ngày tới)
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    const expiringCount = await FridgeItem.countDocuments({ 
        group: user.group,
        useWithin: { $lte: threeDaysFromNow, $gte: new Date() }
    });

    // 3. Đếm danh sách đi chợ
    const listCount = await ShoppingList.countDocuments({ group: user.group });

    res.status(200).json({
        code: '00109', // Mã log hệ thống
        data: {
            fridgeCount,
            expiringCount,
            listCount,
            groupName: 'Gia đình'
        }
    });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
