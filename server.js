import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, 
}));
app.use(morgan('dev'));
app.use(express.json()); // Parse incoming JSON requests

// MongoDB Connection
const connectDb = async () => {
  try {
    await mongoose.connect("mongodb+srv://ASP:ASP123@spyzy.cr7opeb.mongodb.net/nodejs");
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
};

// Call the function to connect to the database
connectDb();

// Define the User Schema and Model directly
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Define the /register route directly in server.js
app.post('/register', async (req, res) => {
  try {
    const { name, lastname, email, phone, password } = req.body;

    // Validation
    if (!name || !lastname || !email || !phone || !password) {
      return res.status(400).send("All fields are required");
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    // Create new user
    const newUser = await User.create({ name, lastname, email, phone, password });

    res.status(201).send({
      status: 'success',
      message: 'User registered successfully',
      user: newUser,
    });
  } catch (error) {
    console.error(`Error in register route: ${error}`);
    res.status(500).send('Internal server error');
  }
});

// Test Route
app.get('/', (req, res) => {
  res.send({
    message: "Welcome to the API!"
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
