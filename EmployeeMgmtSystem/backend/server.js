const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { authRouter } = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
// express.json() allows us to parse incoming JSON payloads
app.use(express.json());

// CORS is configured to allow credentials (cookies) to be sent from the frontend to the backend
app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true
}));

// Session configuration for handling user logins statefully
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true, // Prevents client-side JS from reading the cookie
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// Function to automatically create an admin user if none exists
const seedAdminUser = async () => {
    try {
        const adminExists = await User.findOne({ username: 'admin' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const newAdmin = new User({
                username: 'admin',
                password: hashedPassword
            });
            await newAdmin.save();
            console.log('Default Admin user created (username: admin, password: admin123)');
        } else {
            console.log('Default Admin user already exists.');
        }
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
};

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully!');
        // Seed the database with our default admin user upon connection
        seedAdminUser();
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err.message);
    });

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/employees', employeeRoutes);

// Basic health check route
app.get('/', (req, res) => {
    res.send('Employee System Backend is running.');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
