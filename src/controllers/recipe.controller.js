const Recipe = require('../models/recipe.model');
const User = require('../models/user.model');

exports.createRecipe = async (req, res) => {
  try {
    const { name, description, ingredients, instruction } = req.body;
    const user = await User.findById(req.user._id);
    if (!user.group) return res.status(400).json({ message: 'Chưa vào nhóm' });

    const newRecipe = await Recipe.create({
      name, description, ingredients, instruction, group: user.group
    });
    res.status(201).json({ code: '00357', data: newRecipe });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.group) return res.status(400).json({ message: 'Chưa vào nhóm' });
    const recipes = await Recipe.find({ group: user.group });
    res.status(200).json({ code: '00378', data: recipes });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
exports.updateRecipe = async (req, res) => {
  try {
    const { name, description, ingredients, instruction } = req.body;
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { name, description, ingredients, instruction },
      { new: true }
    );
    res.status(200).json({ code: '00388', data: updatedRecipe });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
