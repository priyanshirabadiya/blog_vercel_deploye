const express = require('express');
const postRoutes = express.Router();

const {
    uploadPost,
    getAllposts,
    getSinglePost,
    updatePost,
    addComment,
    getAllComments,
    deletePost,
    deleteComment,
    userPosts,
    ratePost,
    getRatedPosts,
} = require('../controller/blogPost.controller');

const { upload } = require('../helpers/imageUpload');
const { verifyToken } = require('../helpers/verifyToken');

postRoutes.post('/uploadpost', verifyToken, upload.single('imageUpload'), uploadPost);

postRoutes.get('/getall', verifyToken, getAllposts);

postRoutes.get('/getsingle/:_id', verifyToken, getSinglePost);

postRoutes.put('/update/:id', verifyToken, upload.single('imageUpload'), updatePost);

postRoutes.delete('/deletepost/:id', verifyToken, deletePost);

postRoutes.post('/addcomment', verifyToken, addComment);

postRoutes.delete('/deletecomment/:id', verifyToken, deleteComment);

postRoutes.get('/allcomments/:postId', verifyToken, getAllComments);

postRoutes.get('/user-posts', verifyToken, userPosts);

postRoutes.post('/rate/:id', verifyToken, ratePost);

postRoutes.get('/get-rated-posts', verifyToken, getRatedPosts);

module.exports = postRoutes;