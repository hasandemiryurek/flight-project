const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');

router.post('/', flightController.createFlight);
router.get('/search', flightController.searchFlights);
router.put('/:id', flightController.updateFlight);
router.delete('/:id', flightController.deleteFlight);

module.exports = router;