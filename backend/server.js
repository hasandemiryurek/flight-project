require('dotenv').config();
const cors = require('cors');
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`FlyTicket Server is running on port ${PORT}...`);
});