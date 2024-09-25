import express from "express";
import cors from "cors";
import morgan from "morgan";
import colors from "colors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "../ApiCallingNode/MVC/Route/authRout.js"
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
app.use(express.json());

// Database Connection
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://ASP:ASP123@spyzy.cr7opeb.mongodb.net/nodejs");
    console.log("Database connected successfully".bgMagenta.green);
  } catch (error) {
    console.error("Database connection failed".bgBlue.red, error);
    process.exit(1);
  }
};

// Call the function to connect to the database
connectDb();

// Test Route
app.get('/', (req, res) => {
  res.send({
    message: "hello deepak"
  });
});

// API Routes
app.use('/api/v1/user', authRoutes); // Correct route path

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Listening to port number ${PORT}`.bgCyan.blue);
});
