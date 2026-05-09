const prisma = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const ticketInclude = {
    flight: {
        include: {
            city_flight_from_city_idTocity: true,
            city_flight_to_city_idTocity: true
        }
    }
};

exports.bookTicket = async (req, res) => {
    try {
        const { passenger_name, passenger_surname, passenger_email, flight_id, seat_number } = req.body;

        if (!passenger_name || !passenger_surname || !passenger_email || !flight_id) {
            return res.status(400).json({ error: 'All passenger fields and flight_id are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(passenger_email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        const result = await prisma.$transaction(async (tx) => {
            const flight = await tx.flight.findUnique({ where: { id: flight_id } });
            if (!flight) throw new Error('Flight not found');
            if (flight.seats_available <= 0) throw new Error('No seats available for this flight');

            let assignedSeat = seat_number;
            if (!assignedSeat) {
                const bookedTickets = await tx.ticket.findMany({
                    where: { flight_id },
                    select: { seat_number: true }
                });
                const bookedSeats = new Set(bookedTickets.map(t => t.seat_number).filter(Boolean));
                for (let i = 1; i <= flight.seats_total; i++) {
                    const seatLabel = String(i);
                    if (!bookedSeats.has(seatLabel)) {
                        assignedSeat = seatLabel;
                        break;
                    }
                }
            }

            const ticket = await tx.ticket.create({
                data: {
                    id: uuidv4(),
                    passenger_name,
                    passenger_surname,
                    passenger_email,
                    flight_id,
                    seat_number: assignedSeat
                },
                include: ticketInclude
            });

            await tx.flight.update({
                where: { id: flight_id },
                data: { seats_available: { decrement: 1 } }
            });

            return ticket;
        });

        res.status(201).json({ message: 'Ticket booked successfully!', ticket: result });
    } catch (error) {
        console.error('Booking Error:', error);
        res.status(400).json({ error: error.message || 'Failed to book ticket' });
    }
};

exports.getTicketsByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const tickets = await prisma.ticket.findMany({
            where: { passenger_email: email },
            include: ticketInclude,
            orderBy: { flight: { departure_time: 'asc' } }
        });
        res.json(tickets);
    } catch (error) {
        console.error('GET Tickets By Email Error:', error);
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
};

exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await prisma.ticket.findMany({
            include: ticketInclude,
            orderBy: { flight: { departure_time: 'asc' } }
        });
        res.json(tickets);
    } catch (error) {
        console.error('GET All Tickets Error:', error);
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
};