const auth = require('../middleware/auth')
const Users = require('../models/userModel')
const cloudinary = require('../helper/ImageUpload');
const userCtrl = {
    searchUser: async (req, res) => {
        try {
            const users = await Users.find({ username: { $regex: req.query.username } })
                .limit(10).select("fullname username avatar").populate("followers following", "-password")

            res.json({ users })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.params.id).select('-password')
                .populate("followers following", "-password")
            if (!user) return res.status(400).json({ msg: "User does not exist." })

            res.json({ user })
            console.log(user.email)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateUser: async (req, res) => {
        try {
            const { fullname, username, avatar, gender, birthday } = req.body
            if (!fullname) return res.status(400).json({ msg: "Please add your full name." })
            if (!avatar) return res.status(400).json({ msg: "Please pick your avatar." })
            await Users.findOneAndUpdate({ id: req.decoded.id }, {
                fullname, username, avatar, gender, birthday
            })

            res.json({ msg: "Update Success!" })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    follow: async (req, res) => {
        try {
            if (req.body.userId !== req.params.id) {
                try {
                    const user = await Users.findById(req.params.id);
                    const currentUser = await Users.findById(req.body.userId);
                    if (!user.followers.includes(req.body.userId)) {
                        await user.updateOne({ $push: { followers: req.body.userId } });
                        await currentUser.updateOne({ $push: { following: req.params.id } });
                        // res.status(200).json("user has been followed");
                        res.json({ msg: "user has been followed" })
                    } else {
                        // res.status(403).json("you allready follow this user");
                        res.json({ msg: "you allready follow this user!" })
                    }
                } catch (err) {
                    res.status(500).json(err);
                }
            } else {
                // res.status(403).json("you cant follow yourself");
                res.json({ msg: "you cant follow yourself" })
            }

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    unfollow: async (req, res) => {
        try {
            if (req.body.userId !== req.params.id) {
                try {
                    const user = await Users.findById(req.params.id);
                    const currentUser = await Users.findById(req.body.userId);
                    if (user.followers.includes(req.body.userId)) {
                        await user.updateOne({ $pull: { followers: req.body.userId } });
                        await currentUser.updateOne({ $pull: { following: req.params.id } });
                        // res.status(200).json("user has been unfollowed");
                        res.json({ msg: "user has been unfollowed" })
                    } else {
                        // res.status(403).json("you dont follow this user");
                        res.json({ msg: "you dont follow this user" })
                    }
                } catch (err) {
                    res.status(500).json(err);
                }
            } else {
                // res.status(403).json("you cant unfollow yourself");
                res.json({ msg: "you cant unfollow yourself" })
            }

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    suggestionsUser: async (req, res) => {
        try {
            const newArr = [...req.user.following, req.user._id]

            const num = req.query.num || 10

            const users = await Users.aggregate([
                { $match: { _id: { $nin: newArr } } },
                { $sample: { size: Number(num) } },
                { $lookup: { from: 'users', localField: 'followers', foreignField: '_id', as: 'followers' } },
                { $lookup: { from: 'users', localField: 'following', foreignField: '_id', as: 'following' } },
            ]).project("-password")

            return res.json({
                users,
                result: users.length
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    uploadProfile: async (req, res) => {
        const user = await Users.findOne({ id: req.decoded.id })
        if (!user) return res.status(400).json({ msg: "User does not exist." })

        try {
            const result = await cloudinary.uploader.upload(req.file.path, {
                public_id: `${user._id}_profile`,
                width: 500,
                height: 500,
                crop: 'fill',
            });

            const updatedUser = await Users.findByIdAndUpdate(
                user._id,
                { avatar: result.url },
                { new: true }
            );
            res
                .status(201)
                .json({ success: true, message: 'Your profile has updated!' });
        } catch (error) {
            res
                .status(500)
                .json({ success: false, message: 'server error, try after some time' });
            console.log('Error while uploading profile image', error.message);
        }
    }
}


module.exports = userCtrl