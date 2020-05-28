const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = async (req, res, next) => {
    const currentPage = req.query.page || 1; // default page = 1 if req.query.page = undefined
    const perPage = 2;
    try {
        const totalItems = await Post.find().countDocuments();   // totalItems = total posts in db
        const posts = await Post.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
        res
            .status(200)
            .json({
                message: 'Fetched posts successfully.',
                posts: posts,
                totalItems: totalItems
            })
    } catch (err) {
        if (!err.statusCode) { // To Refactor: ErrProcessor(err, status, msg?) + 1k Market Messages?
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;    // will exit function execution and try to reach  the next Err handling middleware in the Express App
    }
    if (!req.file) {
        const error = new Error('No image provided.');
        error.statusCode = 422;
        throw error;
    }
    const imageUrl = req.file.path; // file path generated by multer as configd in app.js 
    const title = req.body.title;
    const content = req.body.content;
    let creator;
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.userId
    });
    post.save().then(result => {
        return User.findById(req.userId);   // find the currently loggedin user
    })
        .then(user => {
            creator = user;
            user.posts.push(post);  // add the new post to the list of posts of the user
            return user.save();
        })
        .then(result => {
            res.status(201).json({  // 201 = Success: Resource was created
                message: 'Post created successfully!',
                post: post,
                creator: { _id: creator._id, name: creator.name }
            });
        })
        .catch(err => {
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
            if (!err.statusCode) {  // To Refactor: ErrProc(err, 500, msg?)
                err.statusCode = 500;
            }
            next(err);  // throw will not work in async => use next(err) for Err Express Middleware
        });
};

exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;    // will exit function execution and try to reach  the next Err handling middleware in the Express App
    }
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image; // in case post image is not changed, image sent by Frontend
    if (req.file) {
        imageUrl = req.file.path; // if a new file / image is provided
    }
    if (!imageUrl) {
        const error = new Error('No file picked.');
        error.statuscode = 422; // validation error
        throw error;
    }
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Could not find post.');
                error.statusCode = 404;
                throw error; // if use throw in then block => next catch will be reached
            }   // past this point we found the post in the db to update
            if (post.creator.toString() !== req.userId) {
                const error = new Error('Not authorized');
                error.statusCode = 403; // Not authorized
                throw error;
            }
            if (imageUrl !== post.imageUrl) { // new image file was uploaded
                clearImage(post.imageUrl); // delete the old image on the server !!
            }
            post.title = title;
            post.imageUrl = imageUrl;
            post.content = content;
            return post.save(); // overwrite the old post in the db but keeping the old id
        })
        .then(result => {
            res.status(200).json({ message: 'Post updated', post: result })
        })
        .catch(err => {
            if (!err.statusCode) {  // To Refactor: ErrProc(err, 500, msg?)
                err.statusCode = 500;
            }
            next(err);  // throw will not work in async => use next(err) for Err Express Middleware
        });
};

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Could not find post.');
                error.statusCode = 404;
                throw error; // if use throw in then block => next catch will be reached
            }
            if (post.creator.toString() !== req.userId) {
                const error = new Error('Not authorized');
                error.statusCode = 403; // Not authorized
                throw error;
            }
            // Check logged in user
            clearImage(post.imageUrl);
            return Post.findByIdAndRemove(postId);
        })
        .then(result => {
            return User.findById(req.userId);
        })
        .then(user => {
            user.posts.pull(postId);    // remove the deleted post from the creator's list
            return user.save();
        })
        .then(result => {
            res.status(200).json({ message: 'Deleted post.' })
        })
        .catch(err => {
            if (!err.statusCode) {  // To Refactor: ErrProcessor(err, 500, msg?) + 1k Market Messages?
                err.statusCode = 500;
            }
            next(err);  // throw will not work in async => use next(err) for Err Express Middleware
        });
};

const clearImage = filePath => {
    filePath = path.join(__dirname, '../', filePath);
    fs.unlink(filePath, err => console.log(err));    // delete the file / image
}; 