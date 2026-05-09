const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.post('/', ticketController.bookTicket);
router.get('/all', verifyAdmin, ticketController.getAllTickets);
router.get('/:email', ticketController.getTicketsByEmail);

module.exports = router;