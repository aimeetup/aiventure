exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{
            title: 'First post',
            content: 'This is the first post!'
        }]
    });
};

exports.createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    // Create post in db
    res.status(201).json({  // 201 = Success: Resource was created
        message: 'Post created successfully!',
        post: { id: new Date().toISOString(), title: title, content: content }
    });
};