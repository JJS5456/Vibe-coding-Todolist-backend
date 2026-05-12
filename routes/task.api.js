const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get Tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).json({ status: 'ok', data: tasks });
  } catch (err) {
    res.status(400).json({ status: 'fail', error: err.message });
  }
});

// Create Task
router.post('/', async (req, res) => {
  try {
    const { content, priority, dueDate, favorite, order } = req.body;
    
    if (!content) {
      return res.status(400).json({ status: 'fail', error: 'Content is required' });
    }

    const newTask = new Task({
      content,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      isCompleted: false,
      favorite: favorite || false,
      order: order || 0
    });

    await newTask.save();
    res.status(201).json({ status: 'ok', data: newTask });
  } catch (err) {
    res.status(400).json({ status: 'fail', error: err.message });
  }
});

// Bulk Update Order
router.put('/reorder', async (req, res) => {
  try {
    const { updates } = req.body; // Array of { id, order }
    
    const updatePromises = updates.map(update => 
      Task.findByIdAndUpdate(update.id, { order: update.order })
    );
    
    await Promise.all(updatePromises);
    res.status(200).json({ status: 'ok', message: 'Order updated successfully' });
  } catch (err) {
    console.error("Reorder Error:", err);
    res.status(400).json({ status: 'fail', error: err.message });
  }
});

// Update Task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ status: 'fail', error: 'Task not found' });
    }

    res.status(200).json({ status: 'ok', data: updatedTask });
  } catch (err) {
    console.error("Update Task Error:", err);
    res.status(400).json({ status: 'fail', error: err.message });
  }
});

// Delete Task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ status: 'fail', error: 'Task not found' });
    }

    res.status(200).json({ status: 'ok', message: 'Task deleted successfully' });
  } catch (err) {
    res.status(400).json({ status: 'fail', error: err.message });
  }
});

module.exports = router;
