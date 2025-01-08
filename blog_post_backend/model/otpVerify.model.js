const mongooes = require('mongoose');

const otpVerificationSchema = mongooes.Schema({
    userId: {
        type: mongooes.Schema.Types.ObjectId, ref: 'blog_user', require: true
    },
    otp: {
        type: String
    },
    mail : {
        type : String
    } 
},
    {
        timestamps: true,
        versionKey: false
    })

module.exports = mongooes.model('otp', otpVerificationSchema);
