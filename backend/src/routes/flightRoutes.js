const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.get('/', flightController.getAllFlights);
router.get('/search', flightController.searchFlights);
router.get('/:id', flightController.getFlightById);
router.post('/', verifyAdmin, flightController.createFlight);
router.put('/:id', verifyAdmin, flightController.updateFlight);
router.delete('/:id', verifyAdmin, flightController.deleteFlight);

module.exports = router;