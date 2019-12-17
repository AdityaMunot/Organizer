const express = require('express');
const router = express.Router();
const data = require('../data');
const taskData = data.posts;
const userData = data.users;

router.get('/new', async (req, res) => {
  const users = await userData.getAllUsers();
  res.render('posts/new', {users: users});
});

router.get('/:id', async (req, res) => {
  try {
    const post = await taskData.getTaskById(req.params.id);
    res.render('posts/single', {post: post}); //FIX!!!!!
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router.get('/', async (req, res) => {
  const postList = await taskData.getAllTasks();
  res.render('posts/index', {posts: postList}); //FIX!!!!!
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


  if (errors.length > 0) {
    res.render('posts/new', {
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

    res.redirect(`/posts/${newTask._id}`);
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