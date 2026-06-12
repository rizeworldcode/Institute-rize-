
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB (use the same connection as your app)
const mongoURI = process.env.mongo_URI;

const StudentSchema = new mongoose.Schema({
    student_ID: String,
    admissions: Array,
    // Add other fields if needed
}, { strict: false }); // Strict false to see all fields

const TestStudent = mongoose.model('Student', StudentSchema);

async function test() {
    try {
        await mongoose.connect(mongoURI);
        console.log('✅ Connected to MongoDB');
        
        // Find the student with student_ID = "RW-1236" (from the log)
        const student = await TestStudent.findOne({ student_ID: "RW-1236" });
        
        if (!student) {
            console.log('❌ Student not found! Trying to find any student...');
            const allStudents = await TestStudent.find().limit(2);
            console.log('First 2 students in DB:', JSON.stringify(allStudents, null, 2));
        } else {
            console.log('✅ Found student!');
            console.log('Full student document:', JSON.stringify(student, null, 2));
            console.log('\nAdmissions array:', JSON.stringify(student.admissions, null, 2));
        }
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

test();
