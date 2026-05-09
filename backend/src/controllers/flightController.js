const prisma = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.createFlight = async (req, res) => {
    try {
        const { from_city_id, to_city_id, departure_time, arrival_time, price, seats_total } = req.body;

        // Kural: Aynı saatte aynı şehirden kalkış veya varış kontrolü
        const conflict = await prisma.flight.findFirst({
            where: {
                OR: [
                    { from_city_id, departure_time: new Date(departure_time) },
                    { to_city_id, arrival_time: new Date(arrival_time) }
                ]
            }
        });

        if (conflict) {
            return res.status(400).json({ 
                error: "Scheduling Conflict",
                message: "A flight is already scheduled for this city at this time." 
            });
        }

        const flight = await prisma.flight.create({
            data: {
                id: uuidv4(),
                from_city_id,
                to_city_id,
                departure_time: new Date(departure_time),
                arrival_time: new Date(arrival_time),
                price,
                seats_total,
                seats_available: seats_total
            }
        });

        res.status(201).json({ message: "Flight created successfully", flight_id: flight.id });
    } catch (error) {
        console.error("POST Flight Error:", error);
        res.status(500).json({ error: "Failed to create flight" });
    }
};

exports.searchFlights = async (req, res) => {
    const { from, to, date } = req.query;

    try {
        const flights = await prisma.flight.findMany({
            where: {
                from_city_id: from,
                to_city_id: to,
                // Tarih filtresini şimdilik basit tutuyoruz, 
                // istersen departure_time ile de eşleştirebiliriz.
            },
            include: {
                city_flight_from_city_idTocity: true, // Kalkış şehri detayları
                city_flight_to_city_idTocity: true    // Varış şehri detayları
            }
        });
        res.status(200).json(flights);
    } catch (error) {
        console.error("Flight Search Error:", error);
        res.status(500).json({ error: "Uçuşlar aranırken bir hata oluştu." });
    }
};

exports.deleteFlight = async (req, res) => {
    try {
        await prisma.flight.delete({ where: { id: req.params.id } });
        res.status(200).json({ message: "Flight deleted successfully" });
    } catch (error) {
        console.error("Delete Flight Error:", error);
        res.status(500).json({ error: "Failed to delete flight" });
    }
};

exports.updateFlight = async (req, res) => {
    try {
        const { price, seats_total } = req.body;
        await prisma.flight.update({
            where: { id: req.params.id },
            data: { price, seats_total }
        });
        res.status(200).json({ message: "Flight updated successfully" });
    } catch (error) {
        console.error("Update Flight Error:", error);
        res.status(500).json({ error: "Failed to update flight" });
    }
};