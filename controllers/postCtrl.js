const Posts = require('../models/postModel')

const postCtrl = {
    createPost: async (req, res) => {
        try {
            const { userId, content, images } = req.body

            if (images.length === 0)
                return res.status(400).json({ msg: "Please add your photo." })

            const newPost = new Posts({
                userId, content, images
            })
            await newPost.save()

            res.json({
                msg: 'Created Post!',
                newPost: {
                    ...newPost._doc,
                    user: req.user
                }
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getPosts: async (req, res) => {
        try {
            const post = await Posts.find().populate("userId").sort('-createdAt')
            if (!post) {
                res.status(500).json({
                    success: false,
                });
            }
            res.status(200).send(post);
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}

module.exports = postCtrl