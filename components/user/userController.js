const userService = require('./userService');

exports.getProfile = async (req, res) => {
    res.json({ user: req.user });
}

