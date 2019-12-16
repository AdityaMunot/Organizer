const express = require('express');
const router = express.Router();
const data = require('../data');
const taskData = data.tasks;
const userData = data.users;

router.get('/new', async (req, res) => {
  const users = await userData.getAllUsers();
  res.render('tasks/new', {users: users});
});

router.get('/:id', async (req, res) => {
  try {
    const task = await taskData.getTaskById(req.params.id);
    res.render('tasks/single', {task: task}); //FIX!!!!!
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router.get('/', async (req, res) => {
  const taskList = await taskData.getAllTasks();
  res.render('tasks/index', {tasks: taskList}); //FIX!!!!!
});

router.post('/', async (req, res) => {
  let blogTaskData = req.body;
  let errors = [];

  if (!blogTaskData.title) {
    errors.push('No title provided');
  }

  if (!blogTaskData.body) {
    errors.push('No body provided');
  }

  if (!blogTaskData.posterId) {
    errors.push('No poster selected');
  }

  if (errors.length > 0) {
    res.render('tasks/new', {
      errors: errors,
      hasErrors: true,
      task: blogTaskData
    });
    return;
  }

  try {
    const newTask = await taskData.addTask(
      blogTaskData.title,
      blogTaskData.body,
      blogTaskData.posterId
    );

    res.redirect(`/tasks/${newTask._id}`);
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router.put('/:id', async (req, res) => {
  let updatedData = req.body;
  try {
    await taskData.getTaskById(req.params.id);
  } catch (e) {
    res.status(404).json({error: 'Task not found'});
    return;
  }
  try {
    const updatedTask = await taskData.updateTask(req.params.id, updatedData);
    res.json(updatedTask);
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await taskData.getTaskById(req.params.id);
  } catch (e) {
    res.status(404).json({error: 'Task not found'});
    return;
  }

  try {
    await taskData.removeTask(req.params.id);
    res.sendStatus(200);
  } catch (e) {
    res.status(500).json({error: e});
  }
});

module.exports = router;