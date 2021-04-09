const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { TOKEN_SECRET } = process.env;

const signup = async (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 9),
    });
    try {
        await user.save();
        res.send({ message: 'User was registered successfully!'});
    } catch(e) {
        return res.status(500).send({ message: e });
    }
};

const login = async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username}).exec();
        if (!user)
            return res.status(404).send({ message: 'User not found.' });
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: 'Invalid password!',
            });
        }
        const token = jwt.sign({ id: user.id }, TOKEN_SECRET, {
            expiresIn: 86400 // 24H
        });
        res.status(200).send({
            id: user._id,
            username: user.username,
            email: user.email,
            accessToken: token,
        });
    } catch(e) {
        return res.status(500).send({ message: e });
    }
};

module.exports = {
    signup,
    login,
};
