const express = require('express');
const router = express.Router();
const data = require('../data');
const postData = data.posts;
const userData = data.users;

router.get("/", async (req, res) => {
    try {
        res.render("posts/new.handlebars")
    } catch (e) {
        res.status(404).json({ error: e })
    }
})

router.get('/posts', async (req, res) => {
    const postList = await postData.getAllPosts();
    res.render('posts/index', { posts: postList }); //FIX!!!!!
});


router.post("/posts", async (req, res) => {
    let blogPostData = req.body;
    // let errors = [];

    // if (!blogPostData.title) {
    //     errors.push('No title provided');
    // }

    // if (!blogPostData.body) {
    //     errors.push('No body provided');
    // }


    // if (errors.length > 0) {
    //     res.render('posts/new', {

    //         errors: errors,
    //         hasErrors: true,
    //         post: blogPostData
    //     });
    //     return;
    // }

    try {
        const newPost = await postData.addPost(
            blogPostData.title,
            blogPostData.body,
            blogPostData.id
        );
        console.log("hi")
        res.render('posts/new');
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: e });
    }
})

router.get('/posts/:id', async (req, res) => {
    try {
        const post = await postData.getPostById(req.params.id);
        res.render('posts/single', { post: post }); //FIX!!!!!
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

module.exports = router;