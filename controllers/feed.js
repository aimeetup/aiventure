const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [
            {
                _id: '1',
                title: 'First post',
                content: 'This is the first post!',
                imageUrl: 'images/duck.png',
                creator: {
                    name: 'Steve'
                },
                createdAt: new Date()
            }]
    });
};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;    // will exit function execution and try to reach  the next Err handling middleware in the Express App
    }
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: 'images/duck.png',
        creator: {
            name: 'Steve'
        }
    });
    post.save().then(result => {
        // console.log(result);
        res.status(201).json({  // 201 = Success: Resource was created
            message: 'Post created successfully!',
            post: result
        });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);  // throw will not work in async => use next(err) for Err Express Middleware
    });
};

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {    // if undefined / if not true-ish value
                const error = new Error('Could not find post.');
                error.statusCode = 404;
                throw error; // if use throw in then block => next catch will be reached / with next
            }
            res.status(200).json({ message: 'Post fetched', post: post });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }   // To Refactor: ErrProc(err, 500, msg?)
            next(err);  // throw will not work in async => use next(err) for Err Express Middleware
        });

};