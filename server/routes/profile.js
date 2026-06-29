import express from 'express';
import {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
} from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { roles, industries, departments } from '../data/options.js';

const router = express.Router();

// GET /api/profile - Get user's profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const profile = await getUserProfile(req.userId);

    res.json({
      success: true,
      data: profile || {
        userId: req.userId,
        role: null,
        industry: null,
        department: null,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT /api/profile - Update user's profile
router.put('/', authenticateToken, async (req, res) => {
  try {
    const { role, industry, department } = req.body;

    // Validate input
    if (role && !roles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    if (industry && !industries.includes(industry)) {
      return res.status(400).json({ error: 'Invalid industry' });
    }
    if (department && !departments.includes(department)) {
      return res.status(400).json({ error: 'Invalid department' });
    }

    let profile = await getUserProfile(req.userId);

    if (profile) {
      profile = await updateUserProfile(req.userId, role, industry, department);
    } else {
      profile = await createUserProfile(req.userId, role, industry, department);
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: profile,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// GET /api/profile/options - Get available options
router.get('/options', (req, res) => {
  res.json({
    success: true,
    data: {
      roles,
      industries,
      departments,
    },
  });
});

export default router;
