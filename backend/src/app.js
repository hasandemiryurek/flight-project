const express = require('express');
const cors = require('cors');

const cityRoutes = require('./routes/cityRoutes');
const flightRoutes = require('./routes/flightRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/cities', cityRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/tickets', ticketRoutes);

module.exports = app;