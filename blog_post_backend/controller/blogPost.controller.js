const BlogPost = require('../model/blogPost.model');
const CommentAdd = require('../model/comment.model');
const mongoose = require('mongoose');
const Message = require('../helpers/messages');
const messages = require('../helpers/messages');

exports.updatePost = async (req, res) => {
    const { title, description, categories } = req.body;
    const image = req.file ? req.file.buffer : null;

    try {
        const updateData = { title, description, categories };
        // Wrap image in an object with a `data` property
        if (image) {
            updateData.image = {
                data: image,
                contentType: req.file.mimetype  // Store the content type (e.g., image/jpeg)
            };
        }
        // Update the post with new data
        let updatedPost = await BlogPost.findByIdAndUpdate(req.params.id, updateData, { isDeleted: false }, { new: true });
        if (!updatedPost) return res.status(404).json({ message: Message.POST_NOT_FOUND });

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        let post = await BlogPost.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        res.status(200).send({ post, message: Message.POST_DELETE })
    } catch (error) {
        console.log(error);
        res.status(404).send({ messages: Message.INTERNAL_SERVER_ERROR })
    }
}

exports.uploadPost = async (req, res) => {
    try {

        // console.log("req.user is", req.user);
        let userId = req.user.userID;
        let imageData = {};
        if (req.file) {
            imageData = {
                data: req.file.buffer,
                contentType: req.file.minetype
            };
        }
        let createdpost = await BlogPost.create({
            ...req.body,
            image: imageData,
            userId: userId
        });
        // console.log("Created post is : ", createdpost);
        const postwithUsername = await BlogPost.findById(createdpost._id).populate({
            path: 'userId',
            select: 'userName'
        })
        // console.log("main postwithUsername", postwithUsername);
        // console.log("userName postwithUsername is", postwithUsername.userId.userName);
        res.send({ postwithUsername, userName: postwithUsername.userId.userName, message: Message.POST_ADDED });
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: Message.INTERNAL_SERVER_ERROR });
    }
}

exports.addComment = async (req, res) => {
    try {
        // console.log("Getted user", req.user);

        let userId = req.user.userID;
        // console.log("userId is", userId);

        let comment = await CommentAdd.create({
            ...req.body,
            userId: userId
        });

        // console.log("Added comm : ", comment);

        const commentWithUserName = await CommentAdd.aggregate([
            {
                $match: { _id: comment._id }
            },
            {
                $lookup: {
                    from: "blog_users",
                    localField: "userId",
                    foreignField: "_id",
                    as: 'userInfo'
                }
            },
            {
                $unwind: {
                    path: "$userInfo",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    categories: 1,
                    image: '$userInfo.image',
                    userId: 1,
                    createdDate: 1,
                    userName: '$userInfo.userName',
                    firstName: '$userInfo.firstName',
                }
            }
        ]);

        // console.log(commentWithUserName);

        res.send({ comment, commentWithUserName, message: Message.COMMENT_ADDED });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
};

exports.getAllComments = async (req, res) => {
    try {
        if (!req.params.postId || !mongoose.Types.ObjectId.isValid(req.params.postId)) {
            return res.status(400).send({ message: "Invalid postId" });
        }
        const post = await BlogPost.findById(req.params.postId);
        // console.log("posssst", post);
        if (!post) {
            return res.send({ message: Message.POST_NOT_FOUND });
        }
        // const comments = await CommentAdd.find({ postId: req.params.postId });
        const commentsWithUserInfo = await CommentAdd.aggregate([
            {
                $match: { postId: new mongoose.Types.ObjectId(req.params.postId) }
            },
            {
                $lookup: {
                    from: "blog_users",
                    localField: "userId",
                    foreignField: "_id",
                    as: 'userInfo'
                }
            },
            {
                $unwind: {
                    path: "$userInfo",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    categories: 1,
                    postId: 1,
                    createdDate: 1,
                    userId: 1,
                    userName: '$userInfo.userName',
                    image: '$userInfo.image',
                    comment: 1,
                    date: 1
                }
            },
        ]);

        // console.log("All the comments with user info:", commentsWithUserInfo);
        res.send({ comments: commentsWithUserInfo });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        let deletedcomment = await CommentAdd.findByIdAndDelete(req.params.id);
        res.status(200).send({ deletedcomment, message: Message.COMMENT_DELETED });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: Message.INTERNAL_SERVER_ERROR });
    }
}

exports.userPosts = async (req, res) => {
    try {
        let { userID } = req.user;
        // console.log("Verify user:", userID);

        let allposts = await BlogPost.find({ userId: userID, isDeleted: false }).populate({
            path: 'userId',
            select: 'userName'
        })
        allposts.forEach(post => {
            // console.log("All postes imges are:", post.image);
        })
        if (!allposts) {
            return res.status(401).send({ message: messages.POST_NOT_FOUND });
        }
        // console.log("Post image data before conversion:", allposts.image);

        const postsWithBase64Images = allposts.map(post => ({
            ...post._doc,
            image: post.image && post.image.data ? `data:image/jpeg;base64,${post.image.data.toString('base64')}` : null,
        }
        ));
        // console.log("Posts with Base64 Images:", postsWithBase64Images);
        return res.status(200).send(postsWithBase64Images);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: Message.INTERNAL_SERVER_ERROR })
    }
}

exports.ratePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;
        const userId = req.user.userID;
        // console.log("id.", id);
        // console.log("ratting.", rating);
        // console.log("user.", req.user);
        // console.log("userId.", userId);

        if (!userId) {
            return res.status(400).send({ message: 'User not found' });
        }

        if (typeof rating !== 'number' || rating < 1 || rating > 5) {
            return res.status(400).send({ message: 'Rating must be a number between 1 and 5' });
        }

        const post = await BlogPost.findById(id);
        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        // if the user has already rated the post
        const existingRatingIndex = post.ratings.findIndex(rate => rate.userId.toString() === userId.toString());
        if (existingRatingIndex >= 0) {
            post.ratings[existingRatingIndex].rating = rating; // update their rating
        } else {
            post.ratings.push({ userId, rating });  // if not rated then add a new rating for this user
        }
        await post.save();

        const totalRatings = post.ratings.reduce((sum, r) => sum + r.rating, 0);
        // console.log("Total length is:", post.ratings.length);
        const averageRating = totalRatings / post.ratings.length;

        post.averageRating = averageRating;
        await post.save();

        res.status(200).send({ message: 'Rating updated successfully', averageRating });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
};


exports.getAllposts = async (req, res) => {
    try {
        let category = req.query.category;
        const filter = { isDeleted: false };
        if (category) {
            filter.categories = category;
        }

        const posts = await BlogPost.find(filter)
            .sort({ createdAt: -1 })
            .populate({
                path: 'userId',
                select: 'userName'
            });

        const postsWithRatings = posts.map(post => {
            const imageBase64 = post.image?.data
                ? `data:image/jpeg;base64,${post.image.data.toString('base64')}`
                : null;
            return {
                ...post._doc,
                image: imageBase64,
                userName: post.userId ? post.userId.userName : null
            };
        });
        res.send({ posts: postsWithRatings });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error.' });
    }
};


exports.getRatedPosts = async (req, res) => {
    try {
        let posts = await BlogPost.find({ isDeleted: false })
            .sort({ averageRating: -1 })
            .limit(4);

        const postsWithCommentCounts = await Promise.all(
            posts.map(async (post) => {
                const commentCount = await CommentAdd.countDocuments({ postId: post._id });
                const imageBase64 = post.image?.data
                    ? `data:image/jpeg;base64,${post.image.data.toString('base64')}`
                    : null;

                return {
                    ...post._doc,
                    image: imageBase64,
                    userName: post.userId ? post.userId.userName : null,
                    commentCount,
                };
            })
        );

        res.send({ posts: postsWithCommentCounts });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error.' });
    }
};


exports.getSinglePost = async (req, res) => {
    try {
        const { _id } = req.params;
        let post = await BlogPost.findOne({ _id, isDeleted: false })
            .populate({
                path: 'userId',
                select: 'userName'
            })
            .populate({
                path: 'ratings.userId',  // Populate user data for ratings
                select: 'userName'
            });

        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        const postWithBase64Image = {
            ...post._doc,
            image: post.image?.data ? `data:${post.image.contentType};base64,${post.image.data.toString('base64')}` : null,
            userName: post.userId.userName
        };

        return res.status(200).send(postWithBase64Image);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
};
