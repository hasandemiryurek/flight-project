const prisma = require('../config/db');

exports.getCities = async (req, res) => {
    try {
        // Model adı artık "city", bu yüzden prisma.city kullanıyoruz
        const cities = await prisma.city.findMany({
            orderBy: { city_name: 'asc' }
        });
        
        res.status(200).json(cities);
    } catch (error) {
        console.error("GET Cities Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};