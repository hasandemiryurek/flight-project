<h1 align="center">✈️ FlyTicket - Flight Booking Application</h1>



<br />

> A full-stack web application for booking flights across 81 cities in Türkiye. Developed as the CENG-3502 Dynamic Web Programming Final Project.

## 🚀 Technologies Used

### Frontend
- **React 19 + Vite**
- **React Router v7**
- **Tailwind CSS** (Fully mobile-responsive design)
- `react-datepicker`

### Backend
- **Node.js + Express**
- **Prisma ORM**
- **MySQL 8.0**
- **JWT (JSON Web Token)**
- `bcryptjs`

---

##  Features

###  User Side (Customer)
- View all available flights with a clean UI.
- Search flights dynamically by origin, destination, and date.
- Book a ticket by entering passenger information securely.
- View and print booking confirmation / e-ticket.
- **Bonus:** Fully mobile-responsive design for seamless booking on any device.

###  Admin Side (Admin Panel)
- Secure admin login system using JWT authentication and password hashing.
- Add, edit, and delete flights effortlessly.
- View all ticket bookings across the system.
- **Flight Scheduling Validation (Business Rules):** Advanced backend validation ensures that:
  - No two flights from the same city can depart at the exact same hour.
  - No two flights can arrive at the same city at the exact same arrival time.
  - 81 Cities of Türkiye are supported and validated.

---

##  Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MySQL](https://www.mysql.com/) (v8.0+)

### 1. Clone the repository
```bash
git clone https://github.com/hasandemiryurek/flight-project.git
cd flight-project
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder and configure your database variables:
```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/flyticket"
JWT_SECRET="flyticket-secret-2024"
PORT=5000
```

Run database migrations and seed the initial data (Cities, Admin, etc.):
```bash
npx prisma migrate dev
npx prisma db seed
```

Start the backend server:
```bash
npm start
```
> **Note:** The backend server runs on: `http://localhost:5000`

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
> **Note:** The frontend application runs on: `http://localhost:5173`

### 4. Database Import (Alternative)
If you prefer to import the database directly via SQL dump instead of using Prisma seed, run the following command in the root directory:
```bash
mysql -u root -p flyticket < database.sql
```

---

##  Admin Credentials

To access the admin dashboard, use the following default credentials:

| Username | Password |
| :--- | :--- |
| `admin` | `admin123` |

---

##  API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/flights` | List all flights | No |
| `GET` | `/api/flights/search` | Search flights based on criteria | No |
| `GET` | `/api/flights/:id` | Get specific flight details | No |
| `POST` | `/api/flights` | Create a new flight | **Yes (Admin)** |
| `PUT` | `/api/flights/:id` | Update an existing flight | **Yes (Admin)** |
| `DELETE` | `/api/flights/:id` | Delete a flight | **Yes (Admin)** |
| `POST` | `/api/tickets` | Book a new ticket | No |
| `GET` | `/api/tickets/:email` | Get tickets by user email | No |
| `GET` | `/api/tickets/all` | List all booked tickets | **Yes (Admin)** |
| `GET` | `/api/cities` | List all 81 cities of Türkiye | No |
| `POST` | `/api/admin/login` | Authenticate admin & receive JWT | No |

---

##  Project Structure

```text
flight-project/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema & models (City, Flight, Ticket, Admin)
│   │   └── seed.js             # Initial mock data
│   └── src/
│       ├── controllers/        # Request handlers & logic
│       ├── routes/             # Express API routes
│       └── middleware/         # JWT Auth & Rule Validation
├── frontend/
│   └── src/
│       ├── pages/              # React views (Home, Admin, Booking)
│       ├── components/         # Reusable UI components (Flight Cards, Forms)
│       ├── context/            # State management
│       └── api/                # Axios API calls
└── database.sql                # SQL database dump
```

---
<div align="center">
  <i>Developed by <b>Hasan Demiryürek</b></i>
</div>
