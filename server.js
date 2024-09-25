import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs'; // To hash and compare passwords
import jwt from 'jsonwebtoken'; // To generate a token for user authentication

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

// Register API
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

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({ 
      name, 
      lastname, 
      email, 
      phone, 
      password: hashedPassword // Save the hashed password
    });

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

// New GET API to fetch all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.status(200).json({
      status: 'success',
      users,
    });
  } catch (error) {
    console.error(`Error fetching users: ${error}`);
    res.status(500).send('Internal server error');
  }
});

// Login API
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("User not found");
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid password");
    }

    // Generate a token (optional, but recommended for authentication)
    const token = jwt.sign(
      { userId: user._id, email: user.email }, 
      process.env.JWT_SECRET || 'your_jwt_secret', 
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    res.status(200).send({
      status: 'success',
      message: 'Login successful',
      token, // Send the token to the frontend to store (usually in localStorage or cookies)
      user: {
        name: user.name,
        lastname: user.lastname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(`Error in login route: ${error}`);
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
