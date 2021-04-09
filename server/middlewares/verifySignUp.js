const { User } = require('../models');

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    try {
        const foundUser = await User.findOne({ 
            $or: [
                {username: req.body.username},
                {email: req.body.email}
            ]
        }).exec();
        if (foundUser) {
            return res.status(400).send({
                message: 'Failed! Username or Email are already in use.'
            });
        }
        next();
    } catch(e) {
        return res.status(500).send({ message: e });
    }
};

module.exports = {
    checkDuplicateUsernameOrEmail,
};
