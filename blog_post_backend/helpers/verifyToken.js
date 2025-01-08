const jwt = require('jsonwebtoken');
const messages = require('./messages');

exports.verifyToken = async (req, res, next) => {
    try {
        let authorization = req.headers['authorization']
        if (!authorization) {
            return res.send("Not authorized.");
        }
        let token = authorization.split(" ")[1];
        // console.log(token);
        await jwt.verify(token, process.env.JWT_SECREATE, (error, user) => {
            if (error) {
                return res.status(403).json({ msg: 'Invalid token' });
            }
            req.user = user;
            next();
        });
    } catch (error) {
        console.log(error);
        res.send({ Messages: messages.INTERNAL_SERVER_ERROR });
    }
}
