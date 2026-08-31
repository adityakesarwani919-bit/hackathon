// Populates the database with the same demo patients and doctor account
// that are hardcoded into the frontend, so the API and UI show matching data.
//
// Run with: npm run seed

require('dotenv').config();
const connectDB = require('./config/db');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');

const demoPatients = [
  { patientId: 'PT-1024', name: 'Aarav Mehta', age: 29, gender: 'Male', bloodGroup: 'B+', phone: '9876543210', diagnosis: 'Acute gastritis', status: 'Active' },
  { patientId: 'PT-1025', name: 'Isha Shah', age: 34, gender: 'Female', bloodGroup: 'O+', phone: '9820123456', diagnosis: 'Migraine', status: 'Active' },
  { patientId: 'PT-1026', name: 'Rohan Kulkarni', age: 47, gender: 'Male', bloodGroup: 'A+', phone: '9765432109', diagnosis: 'Hypertension', status: 'Follow-up' },
  { patientId: 'PT-1027', name: 'Ananya Rao', age: 22, gender: 'Female', bloodGroup: 'AB+', phone: '9812345678', diagnosis: 'Viral fever', status: 'Active' },
  { patientId: 'PT-1028', name: 'Kabir Joshi', age: 56, gender: 'Male', bloodGroup: 'O-', phone: '9898989898', diagnosis: 'Type 2 diabetes', status: 'Follow-up' },
  { patientId: 'PT-1029', name: 'Mira Desai', age: 41, gender: 'Female', bloodGroup: 'B+', phone: '9000011111', diagnosis: 'Anemia', status: 'Active' }
];

const seed = async () => {
  await connectDB();

  await Patient.deleteMany({});
  await Patient.insertMany(demoPatients);
  console.log(`Seeded ${demoPatients.length} demo patients.`);

  const doctorEmail = 'doctor@terabyte.demo';
  const doctorExists = await Doctor.findOne({ email: doctorEmail });

  if (!doctorExists) {
    await Doctor.create({
      name: 'Dr. Harsh Dwivedi',
      email: doctorEmail,
      password: 'demo1234',
      role: 'Doctor',
      department: 'General Medicine'
    });
    console.log(`Seeded demo doctor: ${doctorEmail} / demo1234`);
  } else {
    console.log('Demo doctor already exists, skipped.');
  }

  console.log('Done.');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seeding failed:', err.message);
  process.exit(1);
});
