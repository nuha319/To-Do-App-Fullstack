const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const todoRoutes = require("./routes/todoRoutes");

require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Todo routes
app.use("/api/todos", todoRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Todo App Backend is running!");
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");

    const PORT = process.env.PORT || 4000;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error.message);
  });
