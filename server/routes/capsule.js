const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Capsule = require('../models/Capsule');
const auth = require('../middleware/auth');

router.post('/create', auth, async (req, res) => {
  try {
    const capsuleData = { ...req.body, userId: req.user.id };
    const capsule = new Capsule(capsuleData);
    await capsule.save();
    res.status(201).send(capsule);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/user', auth, async (req, res) => {
  try {
    const capsules = await Capsule.find({ userId: req.user.id }).select('-message -image');
    res.send(capsules);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid capsule ID format' });
    }

    const capsule = await Capsule.findById(id);
    if (!capsule) {
      return res.status(404).json({ error: 'Capsule not found' });
    }
    
    const openingTime = new Date(capsule.openingDateTime).getTime();
    const isUnlocked = new Date() >= openingTime;
    
    if (!isUnlocked) {
        // Return only metadata
        const { message, image, ...metadata } = capsule.toObject();
        return res.send({ ...metadata, isLocked: true });
    }

    res.send({ ...capsule.toObject(), isLocked: false });
  } catch (error) {
    console.error('Error fetching capsule:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const capsule = await Capsule.findOne({ _id: req.params.id, userId: req.user.id });
    if (!capsule) return res.status(404).send();

    await Capsule.deleteOne({ _id: req.params.id });
    res.send({ message: 'Capsule deleted' });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
