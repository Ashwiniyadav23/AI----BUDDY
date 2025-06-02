const express = require('express');
const router = express.Router();
const Model = require('../models/models');

// Save selected answers
router.post('/post', async (req, res) => {
  try {
    const { question, answers, savedDate } = req.body;
    const dataToSave = new Model({ question, answers, savedDate });
    const data = await dataToSave.save();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all saved answers
router.get('/getAll', async (req, res) => {
  try {
    const data = await Model.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update by ID
router.patch('/update/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updated = req.body;
    const options = { new: true };
    const data = await Model.findByIdAndUpdate(id, updated, options);
    res.send(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Model.findByIdAndDelete(id);
    res.send(`Data with ID ${id} deleted`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
