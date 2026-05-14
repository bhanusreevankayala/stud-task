const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const protect = require("../middleware/authMiddleware");

// GET TASKS
router.get("/", protect, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user,
    }).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// CREATE TASK
router.post("/", protect, async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      user: req.user,
      completed: false,
    });

    res.status(201).json(task);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// TOGGLE TASK
router.put("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(
      req.params.id
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (
      task.user.toString() !== req.user
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    task.completed = !task.completed;

    await task.save();

    res.json(task);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// DELETE TASK
router.delete(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const task = await Task.findById(
        req.params.id
      );

      if (!task) {
        return res.status(404).json({
          message: "Task not found",
        });
      }

      if (
        task.user.toString() !== req.user
      ) {
        return res.status(401).json({
          message: "Not authorized",
        });
      }

      await task.deleteOne();

      res.json({
        message: "Task deleted",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;