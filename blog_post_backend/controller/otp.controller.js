let User = require('../model/user.model');
let Otp = require('../model/otpVerify.model');
let nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const messages = require('../helpers/messages');

const transport = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: process.env.GMAIL_PORT,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
    }
});

exports.enterMail = async (req, res) => {
    try {
        let mail = req.body.mail;
        let userData = await User.findOne({ email: req.body.mail, isDelete: false })
        if (!userData) {
            return res.status(400).send({ message: "User not found..." });
        }
        let userId = userData._id;
        const generateotp = `${Math.floor(1000 + Math.random() * 9000)}`;

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: mail,
            subject: "Verify your email",
            html: `<p>Enter <b>${generateotp}</b> in the app to verify your email address and complete the process to reset the password.</p>`
        };

        let hashedotp = await bcrypt.hash(generateotp, 10);
        // console.log("Main otp:", generateotp)
        // console.log("Hashed otp:", hashedotp);

        await Otp.create({ ...req.body, userId: userId, otp: hashedotp });

        let sentmail = await transport.sendMail(mailOptions);
        if (sentmail) {
            // console.log("Sent...");
        }
        return res.status(200).send({ message: "mail added successfully...", userId });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
}

exports.verifyenteredOtp = async (req, res) => {
    try {
        let { otp, mail } = req.body;
        // console.log("otp && mail", otp, mail);
        let otpRecord = await Otp.aggregate([
            {
                $lookup: {
                    from: 'blog_users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            { $unwind: "$userInfo" },
            { $match: { "userInfo.email": mail } },
            { $sort: { createdAt: -1 } },
            { $limit: 1 }
        ]);

        // console.log("otp data:", otpRecord);
        // console.log("Otp main:", otpRecord[0].otp);
        if (otpRecord.length === 0) {
            return res.status(400).send({ notfoundmessage: "User not found..." });
        }
        const isValid = await bcrypt.compare(otp, otpRecord[0].otp);
        if (!isValid) {
            return res.status(401).send({ message: 'Please enter correct otp.' });
        }
        return res.status(200).json({ message: 'OTP verified successfully', mail });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
}


// exports.newPassword = async (req, res) => {
//     try {
//         let { mail, newpass, confirmpass } = req.body;

//         let user = await User.findOne({ email: mail });
//         if (!user) {
//             res.status(400).send({ errormessage: messages.USER_NOT_FOUND });
//         }
//         if (newpass !== confirmpass) {
//             res.status(401).send({ errormessage: messages.SAME_PASSWORDS });
//         }
//         let oldpass = user.password;

//         let compareForSamePass = await bcrypt.compare(confirmpass, oldpass);

//         if (compareForSamePass) {
//             return res.status(401), send({ errormessage: messages.OLD_NEW_SAME_PASSWORDS });
//         }
//         // let newuserpass = await bcrypt.hash(confirmpass, 10);
//         user.password = await bcrypt.hash(confirmpass, 10);
//         await user.save();
//         res.status(200).send({ message: "Updated success", user });
//     } catch (error) {
//         console.log('Error verifying OTP:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// }



exports.newPassword = async (req, res) => {
    try {
        let { mail, newpass, confirmpass } = req.body;

        if(newpass === ""  || confirmpass === ""){
            return res.status(400).send({ errormessage: messages.EMPTY_VALUE });
        }

        if (!mail) {
            return res.status(400).send({ errormessage: 'Email is required to reset the password.' });
        }

        // Fetch user by email
        let user = await User.findOne({ email: mail });
        if (!user) {
            return res.status(400).send({ errormessage: messages.USER_NOT_FOUND });
        }

        // Validate passwords
        if (newpass !== confirmpass) {
            return res.status(401).send({ errormessage: messages.SAME_PASSWORDS });
        }

        // Check if new password matches old password
        const compareForSamePass = await bcrypt.compare(newpass, user.password);
        if (compareForSamePass) {
            return res.status(401).send({ errormessage: messages.OLD_NEW_SAME_PASSWORDS });
        }

        // Hash and save the new password
        user.password = await bcrypt.hash(newpass, 10);
        await user.save();

        res.status(200).send({ message: "Password updated successfully.", user });
    } catch (error) {
        console.log('Error resetting password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



