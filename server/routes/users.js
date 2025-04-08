const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Find user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields
    if (name) user.name = name;
    
    // Only update email if user is not using Google OAuth
    if (email && !user.isGoogleAccount) {
      // Check if email is already taken
      const emailExists = await User.findOne({ email, _id: { $ne: req.user.id } });
      
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      
      user.email = email;
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isGoogleAccount: user.isGoogleAccount
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Find user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user is using Google OAuth
    if (user.isGoogleAccount) {
      return res.status(400).json({ 
        message: 'Password change not available for Google accounts' 
      });
    }
    
    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({ success: true, message: 'Password updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
