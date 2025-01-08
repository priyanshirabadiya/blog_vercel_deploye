const mongooes = require('mongoose');

const postSchema = mongooes.Schema({
    title: {
        type: String,
        require: true
    },
    userId: {
        type: mongooes.Schema.Types.ObjectId, ref: 'blog_user', require: true
    },
    description: {
        type: String,
        require: true
    },
    image: {
        data: Buffer,
        contentType: String
    },
    categories: {
        type: String
    },
    ratings: [{
        userId: { type: mongooes.Schema.Types.ObjectId, ref: 'blog_user' },
        rating: Number
    }],
    averageRating: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdDate: {
        type: Date,
        default: Date.now()
    }
},
    {
        timestamps: true,
        versionKey: false
    })

module.exports = mongooes.model('blogposts', postSchema);
