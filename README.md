# Northline Roofing & Exteriors — Roof Estimator

A full-stack roofing estimate application built for Northline Roofing & Exteriors.

The application allows homeowners to answer roofing questions, provide their contact information, and receive an estimated roofing cost range.

It also provides a protected owner panel where an administrator can manage estimator configuration and view captured leads.

## Features

### Public Estimator

- Multi-step roofing estimator
- Questions and options loaded from the backend at runtime
- Roof area input
- Roofing material selection
- Roof pitch selection
- Existing roof layers selection
- Number of stories selection
- Contact information collection
- Server-side estimate calculation
- Estimate range display
- Input validation
- Loading and error states
- Responsive design

### Owner Panel

The owner panel is available at:

/owner

The panel is protected using HTTP Basic Authentication.

The administrator can:

- View the current business configuration
- Edit global pricing modifiers
- Edit question labels
- Enable or disable questions
- Edit pricing options
- View captured leads
- View submitted answers
- View generated estimates

Changes are stored in MongoDB and are used by the public estimator without requiring a frontend redeployment.

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- JavaScript

### Database

- MongoDB
- MongoDB Atlas

## Project Structure

```text
roof-estimator/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── OwnerPanel.jsx
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── index.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env
│
├── .gitignore
└── README.md  

###Prerequisites

Install:
-Node.js 18 or later
-npm
-Git
-A MongoDB Atlas database

Check Node.js:
node --version

Check npm:
npm --version

###Run Locally From a Clean Clone

1. Clone the repository
git clone YOUR_GITHUB_REPOSITORY_URL
Then enter the project:
cd roof-estimator

2. Install frontend dependencies
Open a terminal:

cd client
npm install

3. Install backend dependencies

###Open another terminal.

From the project root:

cd server
npm install


4. Configure backend environment variables

Inside the server directory, create a file named:
.env

Add:
PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin12345

Replace YOUR_MONGODB_CONNECTION_STRING with your MongoDB Atlas connection string.
Do not commit the .env file to GitHub.


5. Start the backend

From the server directory:
npm run dev
The backend runs on:
http://localhost:5000
For a production-style local start, use:
npm start


6. Start the frontend

Open another terminal.
From the project root:

cd client
npm run dev

Vite normally starts the frontend at:
http://localhost:5173
Open that address in your browser.
Application URLs

Public Estimator
http://localhost:5173/

Owner Panel
http://localhost:5173/owner

Backend
http://localhost:5000

###Test Login
Use the following test credentials for the owner panel:

Username: admin
Password: Admin12345

Open:
http://localhost:5173/owner
The browser will request the username and password because the owner API is protected using HTTP Basic Authentication.


Testing the Public Estimator

Open the public estimator.

Enter a roof area within the allowed range.
Select the roofing material.
Select the roof pitch.
Select the number of existing roof layers.
Select the number of stories.
Enter a name.
Enter a phone number.
Enter an email address.
Select Get My Estimate.

The frontend sends the answers to the backend.
The backend calculates the estimate using the stored configuration.
The resulting estimate range is displayed.


###Testing the Owner Panel
Open:
http://localhost:5173/owner
Enter:
Username: admin
Password: Admin12345

Review the estimator configuration.
Edit a pricing value or question setting.
Save the changes.
Open the public estimator.
The updated configuration is loaded from the backend.
Submit a new estimate.
Open the owner panel again.
Verify that the submitted lead is available.


The backend uses the following environment variables:

| Variable | Description |
|---|---|
| PORT | Port used by the Express server |
| MONGO_URI | MongoDB Atlas connection string |
| ADMIN_USERNAME | Username for the protected owner panel |
| ADMIN_PASSWORD | Password for the protected owner panel |

The .env file contains environment-specific secrets and must not be committed to the repository.
Database
MongoDB is used to persist the application configuration and captured leads.

The stored configuration includes:
-Business information
-Estimator questions
-Question labels
-Question types
-Question options
-Pricing values
-Pricing modifiers
-Active/inactive question settings

Captured leads include:
-Contact information
-Submitted answers
-Configuration version
-Generated estimate values
-Capture information

Calculation

The estimate is calculated on the backend.

The frontend collects the homeowner's answers and sends them to the server.

The server reads the current pricing configuration from the database and performs the calculation.

Pricing logic is therefore not exposed as frontend calculation code.

The calculation formula and assumptions are documented separately in DECISIONS.md.


###API Overview

Public Configuration
GET /api/config
Returns the active estimator configuration used by the public estimator.

Estimate
POST /api/estimate
Accepts the homeowner's answers and contact information and returns the calculated estimate.


Owner Configuration
GET /api/owner/config
Returns the owner configuration.
Authentication is required.


Update Owner Configuration
PUT /api/owner/config
Updates the estimator configuration.
Authentication is required.

Owner Leads

GET /api/owner/leads
Returns captured homeowner leads.
Authentication is required.

###Local Development Commands

Frontend

cd client
npm install
npm run dev

Backend

cd server
npm install
npm run dev
Both the frontend and backend must be running during local development.

Troubleshooting
Frontend cannot load the estimator

Make sure the backend is running:
http://localhost:5000

Then restart the frontend:

cd client
npm run dev
Backend does not start

Check:

-Node.js is installed.
-Backend dependencies were installed.
-server/.env exists.
-MONGO_URI is correct.
-MongoDB Atlas is accessible.
-Port 5000 is available.


MongoDB connection fails
Check the MONGO_URI value in:
server/.env
Make sure the MongoDB Atlas cluster is available and the connection string is valid.

Owner login does not work
Check that the values in server/.env are:
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin12345

Restart the backend after changing environment variables.

Security
Never commit the following to GitHub:
-MongoDB passwords
-Database connection strings containing credentials
-Production passwords
-API keys
-Other secrets
Use environment variables for sensitive configuration.


###Assignment Documents

The repository also contains:

-DECISIONS.md — important design decisions, assumptions, calculation formula, scope decisions, and future improvements.

-AI_LOG.md — a record of how AI tools were used during development.

###License

This project was created as part of the Wantace SDE Intern 24-hour task.