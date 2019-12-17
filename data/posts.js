const mongoCollections = require('../config/mongoCollections');
const posts = mongoCollections.posts;
const users = require('./users');
const uuid = require('uuid/v4');

const exportedMethods = {
  async getAllPosts() {
    const postCollection = await posts();
    return await postCollection.find({}).toArray();
  },
  async getPostById(id) {
    const postCollection = await posts();
    const post = await postCollection.findOne({_id: id});

    if (!post) throw 'Post not found';
    return post;
  },
  async addPost(title, body) {
    if (typeof title !== 'string') throw 'No title provided';
    if (typeof body !== 'string') throw 'I aint got nobody!';


    const postCollection = await posts();

    const newPost = {
      title: title,
      body: body,
      _id: uuid()
    };

    const newInsertInformation = await postCollection.insertOne(newPost);
    const newId = newInsertInformation.insertedId;

    // await users.addPostToUser(newId, title);

    return await this.getPostById(newId);
  },
  async removePost(id) {
    const postCollection = await posts();
    let post = null;
    try {
      post = await this.getPostById(id);
    } catch (e) {
      console.log(e);
      return;
    }
    const deletionInfo = await postCollection.removeOne({_id: id});
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete task with id of ${id}`;
    }
    await users.removePostFromUser(id);
    return true;
  },
  async updatePost(id, updatedPost) {
    const postCollection = await posts();

    const updatedPostData = {};

    if (updatedPost.title) {
      updatedPostData.title = updatedPost.title;
    }

    if (updatedPost.body) {
      updatedPostData.body = updatedPost.body;
    }

    await postCollection.updateOne({_id: id}, {$set: updatedPostData});

    return await this.getPostById(id);
  },
};

module.exports = exportedMethods;
