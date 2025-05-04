const Favorite = require('../models/Favorite');

// @desc    Get user favorites
// @route   GET /api/favorites
// @access  Private
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a favorite
// @route   POST /api/favorites
// @access  Private
exports.addFavorite = async (req, res) => {
  try {
    const { countryCode, name, flag } = req.body;
    
    // Validate required fields
    if (!countryCode || !name || !flag) {
      return res.status(400).json({ 
        message: 'Country code, name, and flag are required' 
      });
    }
    
    // Check if already a favorite
    const existingFavorite = await Favorite.findOne({ 
      user: req.user._id, 
      countryCode 
    });
    
    if (existingFavorite) {
      return res.status(400).json({ message: 'Country already in favorites' });
    }
    
    const favorite = await Favorite.create({
      user: req.user._id,
      countryCode,
      name,
      flag
    });
    
    res.status(201).json(favorite);
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Country already in favorites' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove a favorite
// @route   DELETE /api/favorites/:countryCode
// @access  Private
exports.removeFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      user: req.user._id,
      countryCode: req.params.countryCode
    });
    
    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }
    
    res.json({ message: 'Favorite removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check if a country is favorite
// @route   GET /api/favorites/check/:countryCode
// @access  Private
exports.checkFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      user: req.user._id,
      countryCode: req.params.countryCode
    });
    
    res.json({ isFavorite: !!favorite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};