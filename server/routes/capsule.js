const express = require('express');
const router = express.Router();
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
    const capsule = await Capsule.findById(req.params.id);
    if (!capsule) return res.status(404).send();
    
    const openingTime = new Date(capsule.openingDateTime).getTime();
    const isUnlocked = new Date() >= openingTime;
    
    if (!isUnlocked) {
        // Return only metadata
        const { message, image, ...metadata } = capsule.toObject();
        return res.send({ ...metadata, isLocked: true });
    }

    res.send({ ...capsule.toObject(), isLocked: false });
  } catch (error) {
    res.status(500).send(error);
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
