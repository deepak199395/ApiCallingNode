import express from "express";
import cors from "cors";
import morgan from "morgan";
import colors from "colors";
import dotenv from "dotenv";
import connectDb from "./Db/Db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true, // Enable if your requests require credentials (e.g., cookies)
}));
app.use(morgan('dev'));
app.use(express.json());

// Database Connection
connectDb()
  .then(() => {
    console.log("Database connected successfully".green);
  })
  .catch(error => {
    console.error("Database connection failed".red, error);
    process.exit(1); // Exit process with failure
  });

// Test Route
app.get('/', (req, res) => {
  res.send({
    message: "hello deepak"
  });
});

// API Routes
//app.use('/api/v1/user', authRout);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Listening to port number ${PORT}`.bgCyan.blue);
});
//hello
