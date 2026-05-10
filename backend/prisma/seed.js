const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

const CITIES = [
    'Adana', 'Adiyaman', 'Afyonkarahisar', 'Agri', 'Amasya',
    'Ankara', 'Antalya', 'Artvin', 'Aydin', 'Balikesir',
    'Bilecik', 'Bingol', 'Bitlis', 'Bolu', 'Burdur',
    'Bursa', 'Canakkale', 'Cankiri', 'Corum', 'Denizli',
    'Diyarbakir', 'Edirne', 'Elazig', 'Erzincan', 'Erzurum',
    'Eskisehir', 'Gaziantep', 'Giresun', 'Gumushane', 'Hakkari',
    'Hatay', 'Isparta', 'Mersin', 'Istanbul', 'Izmir',
    'Kars', 'Kastamonu', 'Kayseri', 'Kirklareli', 'Kirsehir',
    'Kocaeli', 'Konya', 'Kutahya', 'Malatya', 'Manisa',
    'Kahramanmaras', 'Mardin', 'Mugla', 'Mus', 'Nevsehir',
    'Nigde', 'Ordu', 'Rize', 'Sakarya', 'Samsun',
    'Siirt', 'Sinop', 'Sivas', 'Tekirdag', 'Tokat',
    'Trabzon', 'Tunceli', 'Sanliurfa', 'Usak', 'Van',
    'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman',
    'Kirikkale', 'Batman', 'Sirnak', 'Bartin', 'Ardahan',
    'Igdir', 'Yalova', 'Karabuk', 'Kilis', 'Osmaniye', 'Duzce'
];

async function main() {
    console.log('Seeding database...');

    const cityMap = {};
    for (const name of CITIES) {
        const id = uuidv4();
        const city = await prisma.city.upsert({
            where: { city_name: name },
            update: {},
            create: { id, city_name: name }
        });
        cityMap[name] = city.id;
    }
    console.log(`✓ ${CITIES.length} cities seeded`);

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.admin.upsert({
        where: { username: 'admin' },
        update: {},
        create: { id: uuidv4(), username: 'admin', password: hashedPassword }
    });
    console.log('✓ Admin user seeded (username: admin, password: admin123)');

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const sampleFlights = [
        { from: 'Istanbul', to: 'Ankara',     depH: 6,  arrH: 7,  price: 850,  seats: 180 },
        { from: 'Istanbul', to: 'Izmir',      depH: 8,  arrH: 9,  price: 950,  seats: 160 },
        { from: 'Istanbul', to: 'Antalya',    depH: 10, arrH: 11, price: 1100, seats: 200 },
        { from: 'Istanbul', to: 'Trabzon',    depH: 12, arrH: 13, price: 1200, seats: 140 },
        { from: 'Ankara',   to: 'Istanbul',   depH: 7,  arrH: 8,  price: 850,  seats: 180 },
        { from: 'Ankara',   to: 'Izmir',      depH: 9,  arrH: 10, price: 900,  seats: 150 },
        { from: 'Ankara',   to: 'Antalya',    depH: 11, arrH: 12, price: 1000, seats: 170 },
        { from: 'Izmir',    to: 'Istanbul',   depH: 8,  arrH: 9,  price: 950,  seats: 160 },
        { from: 'Izmir',    to: 'Ankara',     depH: 10, arrH: 11, price: 900,  seats: 150 },
        { from: 'Izmir',    to: 'Antalya',    depH: 14, arrH: 15, price: 750,  seats: 130 },
        { from: 'Antalya',  to: 'Istanbul',   depH: 7,  arrH: 8,  price: 1100, seats: 200 },
        { from: 'Antalya',  to: 'Ankara',     depH: 9,  arrH: 10, price: 1000, seats: 170 },
        { from: 'Trabzon',  to: 'Istanbul',   depH: 6,  arrH: 7,  price: 1200, seats: 140 },
        { from: 'Trabzon',  to: 'Ankara',     depH: 8,  arrH: 9,  price: 1100, seats: 120 },
        { from: 'Samsun',   to: 'Istanbul',   depH: 7,  arrH: 8,  price: 1050, seats: 130 },
        { from: 'Gaziantep',to: 'Istanbul',   depH: 6,  arrH: 7,  price: 1300, seats: 150 },
        { from: 'Diyarbakir',to:'Istanbul',   depH: 7,  arrH: 8,  price: 1400, seats: 140 },
        { from: 'Kayseri',  to: 'Istanbul',   depH: 8,  arrH: 9,  price: 900,  seats: 160 },
        { from: 'Erzurum',  to: 'Ankara',     depH: 7,  arrH: 8,  price: 1350, seats: 120 },
        { from: 'Van',      to: 'Istanbul',   depH: 6,  arrH: 7,  price: 1500, seats: 130 },
    ];

    let flightCount = 0;
    for (const f of sampleFlights) {
        const fromId = cityMap[f.from];
        const toId = cityMap[f.to];
        if (!fromId || !toId) continue;

        const dep = new Date(tomorrow);
        dep.setHours(f.depH, 0, 0, 0);
        const arr = new Date(tomorrow);
        arr.setHours(f.arrH, 30, 0, 0);

        const depHour = new Date(dep); depHour.setMinutes(0, 0, 0);
        const depHourEnd = new Date(depHour); depHourEnd.setMinutes(59, 59, 999);
        const arrHour = new Date(arr); arrHour.setMinutes(0, 0, 0);
        const arrHourEnd = new Date(arrHour); arrHourEnd.setMinutes(59, 59, 999);

        const conflict = await prisma.flight.findFirst({
            where: {
                OR: [
                    { from_city_id: fromId, departure_time: { gte: depHour, lte: depHourEnd } },
                    { to_city_id: toId, arrival_time: { gte: arrHour, lte: arrHourEnd } }
                ]
            }
        });

        if (!conflict) {
            await prisma.flight.create({
                data: {
                    id: uuidv4(),
                    from_city_id: fromId,
                    to_city_id: toId,
                    departure_time: dep,
                    arrival_time: arr,
                    price: f.price,
                    seats_total: f.seats,
                    seats_available: f.seats
                }
            });
            flightCount++;
        }
    }
    console.log(`✓ ${flightCount} sample flights seeded`);
    console.log('\nSeeding complete!');
    console.log('Admin credentials: username=admin, password=admin123');
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());