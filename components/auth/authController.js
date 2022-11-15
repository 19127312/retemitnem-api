const authService = require("./authService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("./userModel");
const refreshTokenModel = require("./refreshTokenModel");

exports.register = async (req, res) => {

    const { fullName, email, password } = req.body;

    const checkingUserEmail = await authService.findByEmail(email);
    try {
        if (!checkingUserEmail) {
            const passwordHash = await bcrypt.hash(password, 10);
            const userDoc = userModel({
                email,
                password: passwordHash,
                fullName,
            });
            const refreshTokenDoc = refreshTokenModel({
                owner: userDoc.id
            });
            await userDoc.save();
            await refreshTokenDoc.save();
            const refreshToken = authService.createRefreshToken({
                email,
                _id: userDoc._id,
                fullName
            }, refreshTokenDoc.id);
            const accessToken = authService.createAccessToken({
                email,
                _id: userDoc._id,
                fullName
            });

            res.json({
                user: {
                    email,
                    fullName,
                    _id: userDoc._id
                },
                refreshToken,
                accessToken,
            })

        }
        else {
            res.status(400).json({ error: "This email address is already used" });
        }
    } catch (error) {

        res.status(400).json({ error: error.message ?? "Unknow Error" });
    }

};

exports.loginSuccess = async (req, res) => {
    const { email, _id, fullName } = req.user;

    const refreshTokenDoc = refreshTokenModel({
        owner: _id
    });
    await refreshTokenDoc.save();

    const refreshToken = authService.createRefreshToken({
        email,
        _id,
        fullName
    }, refreshTokenDoc.id);
    const accessToken = authService.createAccessToken({
        email,
        _id,
        fullName
    });


    res.json({
        user: {
            email,
            fullName,
            _id
        },
        refreshToken,
        accessToken,
    })

}

exports.createNewRefreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    try {
        const currentRefreshToken = await authService.validateRefreshToken(refreshToken);
        const refreshTokenDoc = refreshTokenModel({
            owner: currentRefreshToken._id
        });

        await refreshTokenDoc.save();
        await refreshTokenModel.deleteOne({ _id: currentRefreshToken.tokenId });

        const newRefreshToken = authService.createRefreshToken({
            email: currentRefreshToken.email,
            _id: currentRefreshToken._id,
            fullName: currentRefreshToken.fullName
        }, refreshTokenDoc.id);
        const newAccessToken = authService.createAccessToken({
            email: currentRefreshToken.email,
            _id: currentRefreshToken._id,
            fullName: currentRefreshToken.fullName
        });

        res.json({
            user: {
                email: currentRefreshToken.email,
                fullName: currentRefreshToken.fullName,
                _id: currentRefreshToken._id
            },
            refreshToken: newRefreshToken,
            accessToken: newAccessToken,
        })
    } catch (error) {

        res.status(400).json({ error: error.message ?? "Unknow Error" });
    }
}

exports.createNewAccessToken = (async (req, res) => {
    try {
        const refreshToken = await authService.validateRefreshToken(req.body.refreshToken);
        const accessToken = authService.createAccessToken({
            email: refreshToken.email,
            _id: refreshToken._id,
            fullName: refreshToken.fullName
        });
        res.json({
            user: {
                email: refreshToken.email,
                _id: refreshToken._id,
                fullName: refreshToken.fullName
            },
            accessToken,
            refreshToken: req.body.refreshToken
        })
    } catch (error) {
        res.status(400).json({ error: error.message ?? "Unknow Error" });
    }

});
exports.logout = (async (req, res) => {
    try {
        const refreshToken = await authService.validateRefreshToken(req.body.refreshToken);
        await refreshTokenModel.deleteOne({ _id: refreshToken.tokenId });
        res.json({ message: "Logout successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message ?? "Unknow Error" });
    }
});
exports.logoutAll = (async (req, res) => {
    try {
        const refreshToken = await authService.validateRefreshToken(req.body.refreshToken);
        await refreshTokenModel.deleteMany({ _id: refreshToken.tokenId });
        res.json({ message: "Logout successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message ?? "Unknow Error" });
    }
})