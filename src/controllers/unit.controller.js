const Unit = require('../models/unit.model');

// 1. Create Unit
exports.createUnit = async (req, res) => {
  try {
    const { name } = req.body;
    const newUnit = new Unit({ name });
    await newUnit.save();
    res.status(201).json({ success: true, data: newUnit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get All Units
exports.getAllUnits = async (req, res) => {
  try {
    const units = await Unit.find();
    res.status(200).json({ success: true, data: units });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Edit Unit
exports.updateUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUnit = await Unit.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedUnit) return res.status(404).json({ success: false, message: 'Unit not found' });
    
    res.status(200).json({ success: true, data: updatedUnit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Delete Unit
exports.deleteUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUnit = await Unit.findByIdAndDelete(id);
    
    if (!deletedUnit) return res.status(404).json({ success: false, message: 'Unit not found' });
    
    res.status(200).json({ success: true, message: 'Unit deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};