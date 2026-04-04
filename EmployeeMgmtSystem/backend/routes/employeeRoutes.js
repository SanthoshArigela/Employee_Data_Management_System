const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // For hashing passwords
const Employee = require('../models/Employee');
const { isAuthenticated } = require('./authRoutes');

// Protect all employee routes so only logged-in users can access them
router.use(isAuthenticated);

// Route: Get all employees (with optional search and filter)
router.get('/', async (req, res) => {
    try {
        const { search, department } = req.query;
        let query = {};

        // If a search term is provided, use Regex to find names that match (case-insensitive)
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // If a department filter is provided, exactly match the department
        if (department && department !== 'All') {
            query.department = department;
        }

        const employees = await Employee.find(query).sort({ createdAt: -1 });
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch employees" });
    }
});

// Route: Add a new employee
router.post('/', async (req, res) => {
    try {
        const { name, email, username, password, department, position, salary, status } = req.body;
        
        // Check if employee with same email or username already exists
        const existingEmail = await Employee.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Employee with this email already exists" });
        }

        const existingUser = await Employee.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already taken" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newEmployee = new Employee({ 
            name, 
            email, 
            username, 
            password: hashedPassword, 
            department, 
            position,
            salary,
            status: status || 'active'
        });
        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(400).json({ message: "Failed to add employee" });
    }
});

// Route: Get current employee profile (Self)
router.get('/profile', async (req, res) => {
    try {
        const employee = await Employee.findById(req.session.userId).select('-password');
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch profile" });
    }
});

// Route: Update current employee profile (Self)
router.put('/profile', async (req, res) => {
    try {
        const { email, password } = req.body;
        const update = {};

        // Build only the fields the employee is allowed to change
        if (email) update.email = email;

        if (password && password.trim().length > 0) {
            update.password = await bcrypt.hash(password, 10);
        }

        if (Object.keys(update).length === 0) {
            return res.status(400).json({ message: "No changes provided." });
        }

        // Use $set + runValidators: false so untouched required fields (name, position, etc.)
        // don't cause a validation failure during self-service updates
        const updated = await Employee.findByIdAndUpdate(
            req.session.userId,
            { $set: update },
            { new: true, runValidators: false }
        );

        if (!updated) {
            return res.status(404).json({ message: "Employee not found." });
        }

        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error('Profile update error:', error.message);
        res.status(400).json({ message: "Failed to update profile" });
    }
});


// Route: Update an existing employee
router.put('/:id', async (req, res) => {
    try {
        const { name, email, username, password, department, position, salary, status } = req.body;
        
        // Find existing employee
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        // Update basic info
        employee.name = name || employee.name;
        employee.email = email || employee.email;
        employee.username = username || employee.username;
        employee.department = department || employee.department;
        employee.position = position || employee.position;
        employee.salary = salary || employee.salary;
        employee.status = status || employee.status;

        // Only update and hash password if a new one is provided
        if (password) {
            employee.password = await bcrypt.hash(password, 10);
        }

        await employee.save();
        res.status(200).json(employee);
    } catch (error) {
        res.status(400).json({ message: "Failed to update employee" });
    }
});

// Route: Delete an employee
router.delete('/:id', async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        
        if (!deletedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete employee" });
    }
});

module.exports = router;
