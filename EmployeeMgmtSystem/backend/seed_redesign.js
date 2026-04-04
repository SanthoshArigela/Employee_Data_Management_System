const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Employee = require('./models/Employee');
require('dotenv').config();

const seedData = [
  { name: 'Priya Patel',    email: 'priya@company.com',   username: 'priya_p',   password: 'password123', department: 'Design',       position: 'UI/UX Designer',     salary: 65000, status: 'active'   },
  { name: 'Amit Kumar',     email: 'amit@company.com',    username: 'amit_k',    password: 'password123', department: 'Engineering',   position: 'Tech Lead',           salary: 80000, status: 'active'   },
  { name: 'Sneha Gupta',    email: 'sneha@company.com',   username: 'sneha_g',   password: 'password123', department: 'Marketing',     position: 'Marketing Manager',   salary: 55000, status: 'active'   },
  { name: 'Vikram Singh',   email: 'vikram@company.com',  username: 'vikram_s',  password: 'password123', department: 'Sales',         position: 'Sales Lead',          salary: 70000, status: 'active'   },
  { name: 'Ananya Reddy',   email: 'ananya@company.com',  username: 'ananya_r',  password: 'password123', department: 'HR',            position: 'HR Specialist',       salary: 60000, status: 'active'   },
  { name: 'Karan Mehta',    email: 'karan@company.com',   username: 'karan_m',   password: 'password123', department: 'Support',       position: 'Support Engineer',    salary: 50000, status: 'inactive' },
  { name: 'Deepika Nair',   email: 'deepika@company.com', username: 'deepika_n', password: 'password123', department: 'Finance',       position: 'Financial Analyst',   salary: 72000, status: 'active'   },
  { name: 'Rahul Sharma',   email: 'rahul@company.com',   username: 'rahul_s',   password: 'password123', department: 'Engineering',   position: 'Senior Developer',    salary: 75000, status: 'active'   }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    await Employee.deleteMany({});
    console.log('Cleared existing employees.');

    for (const data of seedData) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const emp = new Employee({ ...data, password: hashedPassword });
      await emp.save();
      console.log(`  Created: ${emp.name} (${emp.username})`);
    }

    console.log('\nSeeding complete! All employees have hashed passwords.');
    console.log('Default login password for all employees: password123');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();
