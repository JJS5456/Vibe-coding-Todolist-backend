const express = require('express');
const router = express.Router();
const taskApi = require('./task.api');

// Mount task routes
router.use('/tasks', taskApi);

module.exports = router;
