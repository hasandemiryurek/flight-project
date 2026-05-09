const prisma = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.bookTicket = async (req, res) => {
    try {
        const { passenger_name, passenger_surname, passenger_email, flight_id } = req.body;

        const result = await prisma.$transaction(async (tx) => {
            const flight = await tx.flight.findUnique({ where: { id: flight_id } });

            if (!flight || flight.seats_available <= 0) {
                throw new Error("No seats available for this flight.");
            }

            const ticket = await tx.ticket.create({
                data: {
                    id: uuidv4(),
                    passenger_name,
                    passenger_surname,
                    passenger_email,
                    flight_id
                }
            });

            await tx.flight.update({
                where: { id: flight_id },
                data: { seats_available: { decrement: 1 } }
            });

            return ticket;
        });

        res.status(201).json({ message: "Ticket booked successfully!", ticket_id: result.id });
    } catch (error) {
        console.error("Booking Error:", error);
        res.status(400).json({ error: error.message || "Failed to book ticket" });
    }
};