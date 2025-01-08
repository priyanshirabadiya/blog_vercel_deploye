const mongooes = require('mongoose');

const userSchema = mongooes.Schema({
    firstName: String,
    lastName : String,
    userName : String,
    email: {
        type: String,
        require: true
    },
    bio : {
        type : String
    },
    password: {
        type: String
    },
    image : {
        type : String
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongooes.model('blog_user', userSchema);
