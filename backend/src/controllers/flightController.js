const prisma = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const flightInclude = {
    city_flight_from_city_idTocity: true,
    city_flight_to_city_idTocity: true
};

exports.getAllFlights = async (req, res) => {
    try {
        const flights = await prisma.flight.findMany({
            include: flightInclude,
            orderBy: { departure_time: 'asc' }
        });
        res.json(flights);
    } catch (error) {
        console.error('GET All Flights Error:', error);
        res.status(500).json({ error: 'Failed to fetch flights' });
    }
};

exports.getFlightById = async (req, res) => {
    try {
        const flight = await prisma.flight.findUnique({
            where: { id: req.params.id },
            include: flightInclude
        });
        if (!flight) return res.status(404).json({ error: 'Flight not found' });
        res.json(flight);
    } catch (error) {
        console.error('GET Flight By ID Error:', error);
        res.status(500).json({ error: 'Failed to fetch flight' });
    }
};

exports.searchFlights = async (req, res) => {
    const { from, to, date } = req.query;
    try {
        const where = {};
        if (from) where.from_city_id = from;
        if (to) where.to_city_id = to;
        if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            where.departure_time = { gte: start, lte: end };
        }
        const flights = await prisma.flight.findMany({
            where,
            include: flightInclude,
            orderBy: { departure_time: 'asc' }
        });
        res.json(flights);
    } catch (error) {
        console.error('Flight Search Error:', error);
        res.status(500).json({ error: 'Failed to search flights' });
    }
};

exports.createFlight = async (req, res) => {
    try {
        const { from_city_id, to_city_id, departure_time, arrival_time, price, seats_total } = req.body;

        if (!from_city_id || !to_city_id || !departure_time || !arrival_time || !price || !seats_total) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (from_city_id === to_city_id) {
            return res.status(400).json({ error: 'Departure and arrival cities cannot be the same' });
        }

        const depTime = new Date(departure_time);
        const arrTime = new Date(arrival_time);

        if (arrTime <= depTime) {
            return res.status(400).json({ error: 'Arrival time must be after departure time' });
        }

        const depHour = new Date(depTime);
        depHour.setMinutes(0, 0, 0);
        const depHourEnd = new Date(depHour);
        depHourEnd.setMinutes(59, 59, 999);

        const arrHour = new Date(arrTime);
        arrHour.setMinutes(0, 0, 0);
        const arrHourEnd = new Date(arrHour);
        arrHourEnd.setMinutes(59, 59, 999);

        const conflict = await prisma.flight.findFirst({
            where: {
                OR: [
                    { from_city_id, departure_time: { gte: depHour, lte: depHourEnd } },
                    { to_city_id, arrival_time: { gte: arrHour, lte: arrHourEnd } }
                ]
            }
        });

        if (conflict) {
            return res.status(400).json({
                error: 'Scheduling Conflict',
                message: 'A flight already departs from that city or arrives at that city within the same hour.'
            });
        }

        const flight = await prisma.flight.create({
            data: {
                id: uuidv4(),
                from_city_id,
                to_city_id,
                departure_time: depTime,
                arrival_time: arrTime,
                price: parseFloat(price),
                seats_total: parseInt(seats_total),
                seats_available: parseInt(seats_total)
            },
            include: flightInclude
        });

        res.status(201).json({ message: 'Flight created successfully', flight });
    } catch (error) {
        console.error('POST Flight Error:', error);
        res.status(500).json({ error: 'Failed to create flight' });
    }
};

exports.updateFlight = async (req, res) => {
    try {
        const { from_city_id, to_city_id, departure_time, arrival_time, price, seats_total } = req.body;
        const existing = await prisma.flight.findUnique({ where: { id: req.params.id } });
        if (!existing) return res.status(404).json({ error: 'Flight not found' });

        const depTime = departure_time ? new Date(departure_time) : existing.departure_time;
        const arrTime = arrival_time ? new Date(arrival_time) : existing.arrival_time;
        const fromCity = from_city_id || existing.from_city_id;
        const toCity = to_city_id || existing.to_city_id;

        if (fromCity === toCity) {
            return res.status(400).json({ error: 'Departure and arrival cities cannot be the same' });
        }
        if (arrTime <= depTime) {
            return res.status(400).json({ error: 'Arrival time must be after departure time' });
        }

        const depHour = new Date(depTime); depHour.setMinutes(0, 0, 0);
        const depHourEnd = new Date(depHour); depHourEnd.setMinutes(59, 59, 999);
        const arrHour = new Date(arrTime); arrHour.setMinutes(0, 0, 0);
        const arrHourEnd = new Date(arrHour); arrHourEnd.setMinutes(59, 59, 999);

        const conflict = await prisma.flight.findFirst({
            where: {
                id: { not: req.params.id },
                OR: [
                    { from_city_id: fromCity, departure_time: { gte: depHour, lte: depHourEnd } },
                    { to_city_id: toCity, arrival_time: { gte: arrHour, lte: arrHourEnd } }
                ]
            }
        });

        if (conflict) {
            return res.status(400).json({
                error: 'Scheduling Conflict',
                message: 'A flight already departs from that city or arrives at that city within the same hour.'
            });
        }

        const seatsDiff = seats_total ? parseInt(seats_total) - existing.seats_total : 0;

        const flight = await prisma.flight.update({
            where: { id: req.params.id },
            data: {
                from_city_id: fromCity,
                to_city_id: toCity,
                departure_time: depTime,
                arrival_time: arrTime,
                price: price ? parseFloat(price) : existing.price,
                seats_total: seats_total ? parseInt(seats_total) : existing.seats_total,
                seats_available: Math.max(0, existing.seats_available + seatsDiff)
            },
            include: flightInclude
        });

        res.json({ message: 'Flight updated successfully', flight });
    } catch (error) {
        console.error('Update Flight Error:', error);
        res.status(500).json({ error: 'Failed to update flight' });
    }
};

exports.deleteFlight = async (req, res) => {
    try {
        const existing = await prisma.flight.findUnique({ where: { id: req.params.id } });
        if (!existing) return res.status(404).json({ error: 'Flight not found' });
        await prisma.ticket.deleteMany({ where: { flight_id: req.params.id } });
        await prisma.flight.delete({ where: { id: req.params.id } });
        res.json({ message: 'Flight deleted successfully' });
    } catch (error) {
        console.error('Delete Flight Error:', error);
        res.status(500).json({ error: 'Failed to delete flight' });
    }
};