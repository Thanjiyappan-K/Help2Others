# Help2Others - Full Stack Food Rescue Platform

Help2Others is a comprehensive web application designed to connect surplus food donors (restaurants, hotels, individuals) with beneficiaries (NGOs, orphanages, shelters) through a reliable network of delivery volunteers and social workers. 

The platform facilitates the seamless donation, verification, and delivery of food to eliminate food waste and fight hunger.

---

## 🏗️ Overall Architecture

The application is built using a modern decoupled architecture:
- **Frontend**: A single-page application (SPA) built with React.js using Vite.
- **Backend**: A RESTful API built with Node.js, Express.js, and Sequelize ORM.
- **Database**: Relational database operations using Sequelize (typically MySQL/PostgreSQL).

---

## ✨ Features by Role

### 1. 🍽️ Food Donors (Restaurants/Hotels/Individuals)
- **Donation Creation**: Multi-step form to specify food type, quantity, expiry time, and pickup location.
- **Geolocation Support**: Automatic address filling via browser location.
- **Dashboard & Analytics**: View impact statistics (meals donated, CO2 reduced, kilos saved).
- **Notifications system**: Alerts regarding pickup requests and status updates.

### 2. 🛡️ Social Workers (Quality Verification)
- **District-wise oversight**: Filter and view pending food donations in a selected district.
- **Quality Control**: Comprehensive checklist to verify freshness, packaging, temperature, and quantity.
- **Documentation**: Evidence upload functionality for verification.
- **Approval Engine**: Accept or reject donations, triggering notifications to delivery volunteers.

### 3. 🚚 Delivery Volunteers (Pickers)
- **Delivery Dashboard**: View list of *Verified* donations ready for pickup in their district.
- **Status Updates**: Mark donations as successfully delivered upon drop-off.
- **Routing info**: Access to donor address and location data.

### 4. 🏠 Beneficiaries (NGOs, Shelters, Homes)
- **Registration**: Multi-step onboarding to request continuous or ad-hoc food supply.
- **Capacity Definition**: Specify total capacity, demographics, and dietary restrictions.
- **Needs Assessment**: Detail the frequency of supply and specific meal needs (breakfast, lunch, dinner).

---

## 💻 Technical Stack

### Frontend
- **Framework**: React.js 18
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **Styling**: Vanilla CSS with modern flex/grid layouts
- **State Management**: React Hooks (useState, useEffect)
- **Network Requests**: Axios

### Backend
- **Environment**: Node.js
- **Framework**: Express.js
- **Database ORM**: Sequelize
- **Validation**: express-validator
- **File Uploads**: Multer (via local file storage)
- **Cross-Origin**: CORS enabled

---

## 📂 Codebase Structure

```text
Help2Others/
├── frontend/                   # Frontend React Application
│   ├── src/
│   │   ├── Component/          # UI Components arranged by feature/role
│   │   │   ├── Donor/          # Donor specific UI elements
│   │   │   ├── Homes/          # Beneficiary registration flows
│   │   │   ├── Land/           # Landing page & filters
│   │   │   ├── Picker/         # Delivery dashboard
│   │   │   └── Socialworker/   # QA and Verification dashboard
│   │   ├── utils/              # Helper functions (geolocation, etc.)
│   │   ├── App.jsx             # Main Router wrapper
│   │   └── main.jsx            # React Entry Point
│   └── vite.config.js          # Vite build config
│
└── node-backend/               # Node.js API Service
    ├── src/
    │   ├── config/             # DB configurations
    │   ├── models/             # Sequelize Data Models
    │   │   ├── Beneficiary.js
    │   │   ├── DeliveryVolunteer.js
    │   │   ├── Donation.js
    │   │   ├── RecurringSchedule.js
    │   │   └── SocialWorker.js
    │   ├── routes/             # Express Route Handlers
    │   ├── services/           # Business logic & Multer config
    │   └── server.js           # Express App Entry Point
    └── uploads/                # Local storage for uploaded files
```

---

## 🗄️ Database Models & Relationships

1. **Donation**: The core entity storing food details, quantities, timestamps, status (`pending`, `verified`, `delivered`, `rejected`), and location data.
2. **Beneficiary**: Organizations receiving food.
   - *Relationship*: `Beneficiary` has many `Donations` (as recipients).
3. **SocialWorker**: Administrators who verify food.
   - *Relationship*: `Donation` belongs to `SocialWorker` via `verifiedBy` foreign key.
4. **DeliveryVolunteer**: Staff who pick up food.
   - *Relationship*: `Donation` belongs to `DeliveryVolunteer` via `deliveredBy` foreign key.
5. **RecurringSchedule**: Defines auto-repeating donation rules for regular donors.

---

## 🔌 Core API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/api/donations` | Create a new food donation (Supports Multer multipart/form-data for image uploads) |
| **GET** | `/api/donations` | Fetch a list of all donations (ordered by creation date) |
| **GET** | `/api/donors?district={district}` | Query donations dynamically by a specific district / city |
| **PATCH**| `/api/donations/:donationId/status` | Update a donation's state (`verified`, `delivered`, `rejected`) and link the responsible ID |
| **POST** | `/api/notify-social-worker` | Matches a newly created donation to an available social worker in the district |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- NPM or Yarn
- Valid Database instance (MySQL/PostgreSQL) running locally

### 1. Setup Backend
```bash
cd node-backend
npm install
```
Configure your `.env` file in the `node-backend` folder with your database credentials:
```env
PORT=8080
DB_HOST=localhost
DB_USER=root
DB_PASS=password
DB_NAME=help2others_db
```
Start the backend server:
```bash
npm run dev
# The backend will automatically synchronize Sequelize schemas (`alter: true`)
```

### 2. Setup Frontend
```bash
cd frontend
npm install
```
Start the Vite development server:
```bash
npm run dev
```

The application will be accessible at `http://localhost:5173/` by default.
