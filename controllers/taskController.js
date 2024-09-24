const Task = require("../models/Task");

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      user: req.user.id,
    });

    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(401).json({
        success: false,
        error: "Task not found",
      });
    }

    if (task.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ success: false, error: "Not authorized to update this task" });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;

    await task.save();

    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(400).json({
        success: false,
        error: "Task not found",
      });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to delete task",
      });
    }

    await task.deleteOne();

    res.json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
