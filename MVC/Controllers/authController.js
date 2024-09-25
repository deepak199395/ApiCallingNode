import userModel from "../Models/userModel.js";

export const createUser = async (req, res) => {
  try {
    const { name, lastname, email, phone, password } = req.body;

    // Validation
    if (!name) return res.status(400).send("Name is required");
    if (!lastname) return res.status(400).send("Lastname is required");
    if (!email) return res.status(400).send("Email is required");
    if (!phone) return res.status(400).send("Phone is required");
    if (!password) return res.status(400).send("Password is required");

    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    // Create a new user
    const newUser = await userModel.create({
      name,
      lastname,
      email,
      phone,
      password,
    });

    // Send success response
    res.status(201).send({
      status: "success",
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error(`Error in API: ${error}`);
    res.status(500).send("Internal server error");
  }
};
