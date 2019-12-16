const mongoCollections = require('../config/mongoCollections');
const tasks = mongoCollections.tasks;
const users = require('./users');
const uuid = require('uuid/v4');

const exportedMethods = {
  async getAllTasks() {
    const taskCollection = await tasks();
    return await taskCollection.find({}).toArray();
  },
  async getTaskById(id) {
    const taskCollection = await tasks();
    const task = await taskCollection.findOne({_id: id});

    if (!task) throw 'Task not found';
    return task;
  },
  async addTask(title, body, posterId) {
    if (typeof title !== 'string') throw 'No title provided';
    if (typeof body !== 'string') throw 'I aint got nobody!';


    const taskCollection = await tasks();

    const userThatPosted = await users.getUserById(posterId);

    const newTask = {
      title: title,
      body: body,
      poster: {
        id: posterId,
        name: `${userThatPosted.firstName} ${userThatPosted.lastName}`
      },
      _id: uuid()
    };

    const newInsertInformation = await taskCollection.insertOne(newTask);
    const newId = newInsertInformation.insertedId;

    await users.addTaskToUser(posterId, newId, title);

    return await this.getTaskById(newId);
  },
  async removeTask(id) {
    const taskCollection = await tasks();
    let task = null;
    try {
      task = await this.getTaskById(id);
    } catch (e) {
      console.log(e);
      return;
    }
    const deletionInfo = await taskCollection.removeOne({_id: id});
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete task with id of ${id}`;
    }
    await users.removeTaskFromUser(task.poster.id, id);
    return true;
  },
  async updateTask(id, updatedTask) {
    const taskCollection = await tasks();

    const updatedTaskData = {};

    if (updatedTask.title) {
      updatedTaskData.title = updatedTask.title;
    }

    if (updatedTask.body) {
      updatedTaskData.body = updatedTask.body;
    }

    await taskCollection.updateOne({_id: id}, {$set: updatedTaskData});

    return await this.getTaskById(id);
  },
};

module.exports = exportedMethods;
