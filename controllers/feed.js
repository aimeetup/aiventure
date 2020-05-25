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
                date: new Date()
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