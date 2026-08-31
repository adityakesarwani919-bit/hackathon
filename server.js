require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const caseRoutes = require('./routes/caseRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error(
    'Missing MONGO_URI or JWT_SECRET. Copy backend/.env.example to backend/.env and fill in real values.'
  );
  process.exit(1);
}

connectDB();

const app = express();

app.use(helmet());
app.use(cors()); // open for the hackathon demo — restrict `origin` before any real deployment
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Vitaline API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve the frontend so the whole app can be deployed from one server.
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Vitaline backend running on http://localhost:${PORT}`));
