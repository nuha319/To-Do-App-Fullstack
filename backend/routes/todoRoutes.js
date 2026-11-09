const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Todo = require("../models/Todo");

// =====================================
// 1. CREATE a new Todo
// POST: /api/todos
// =====================================
router.post("/", async (req, res) => {
  try {
    const { title } = req.body;

    // Validate the title
    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Todo title is required!",
      });
    }

    const newTodo = new Todo({
      title: title,
    });

    const savedTodo = await newTodo.save();

    res.status(201).json({
      message: "Todo added successfully!",
      todo: savedTodo,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding Todo",
      error: error.message,
    });
  }
});

// =====================================
// 2. READ all Todos
// GET: /api/todos
// =====================================
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find();

    res.status(200).json({
      message: "Todos retrieved successfully!",
      todos: todos,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving Todos",
      error: error.message,
    });
  }
});

// =====================================
// 3. READ a single Todo
// GET: /api/todos/:id
// =====================================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Todo ID!",
      });
    }

    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found!",
      });
    }

    res.status(200).json({
      message: "Todo retrieved successfully!",
      todo: todo,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving Todo",
      error: error.message,
    });
  }
});

// =====================================
// 4. UPDATE a Todo
// PUT: /api/todos/:id
// =====================================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Todo ID!",
      });
    }

    if (title === undefined && completed === undefined) {
      return res.status(400).json({
        message: "Please provide a title or completed status!",
      });
    }

    if (title !== undefined && (typeof title !== "string" || !title.trim())) {
      return res.status(400).json({
        message: "Title must be a non-empty string!",
      });
    }

    if (completed !== undefined && typeof completed !== "boolean") {
      return res.status(400).json({
        message: "Completed must be true or false!",
      });
    }

    const updateData = {};

    if (title !== undefined) {
      updateData.title = title.trim();
    }

    if (completed !== undefined) {
      updateData.completed = completed;
    }

    const updatedTodo = await Todo.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedTodo) {
      return res.status(404).json({
        message: "Todo not found!",
      });
    }

    res.status(200).json({
      message: "Todo updated successfully!",
      todo: updatedTodo,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating Todo",
      error: error.message,
    });
  }
});

// =====================================
// 5. DELETE a Todo
// DELETE: /api/todos/:id
// =====================================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Todo ID!",
      });
    }

    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({
        message: "Todo not found!",
      });
    }

    res.status(200).json({
      message: "Todo deleted successfully!",
      todo: deletedTodo,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting Todo",
      error: error.message,
    });
  }
});

// Export the router
module.exports = router;
