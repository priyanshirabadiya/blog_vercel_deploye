const mongooes = require('mongoose');

const commentSchema = mongooes.Schema({
    userId: {
        type: mongooes.Schema.Types.ObjectId, ref: 'blog_user', require: true
    },
    postId: {
        type: mongooes.Schema.Types.ObjectId, ref: 'blogposts', require: true
    },
    date: {
        type: Date,
    },
    comment: {
        type: String,
        require: true
    },
    isDelete: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true,
        versionKey: false
    })

module.exports = mongooes.model('comments', commentSchema);

