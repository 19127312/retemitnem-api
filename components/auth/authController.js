const authService = require("./authService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("./userModel");
const refreshTokenModel = require("./refreshTokenModel");
const verifyToken = require("./verifyTokenModel");
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
            await userDoc.save();
            const token = new verifyToken({ _userId: userDoc._id, token: crypto.randomBytes(16).toString('hex') });
            // token.save(function (err) {
            //     if (err) {
            //         return res.status(500).send({ msg: err.message });
            //     }

            //     // Send email (use credintials of SendGrid)
            //     var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
            //     var mailOptions = { from: 'no-reply@example.com', to: user.email, subject: 'Account Verification Link', text: 'Hello ' + req.body.name + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + user.email + '\/' + token.token + '\n\nThank You!\n' };
            //     transporter.sendMail(mailOptions, function (err) {
            //         if (err) {
            //             return res.status(500).send({ msg: 'Technical Issue!, Please click on resend for verify your Email.' });
            //         }
            //         return res.status(200).send('A verification email has been sent to ' + user.email + '. It will be expire after one day. If you not get verification Email click on resend token.');
            //     });
            // });
            res.status(200).json({
                message: "Account created. Please activate your account in email to continue"
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

exports.googleLogin = (async (req, res) => {
    const { token } = req.body;
    try {
        const userInfo = await authService.getGoogleUserInfo(token);
        const checkingUserEmail = await authService.findByEmail(userInfo.email);
        console.log(checkingUserEmail);
        let idUser = null;
        // Chưa có tài khoản trong databse
        if (!checkingUserEmail) {
            const userDoc = userModel({
                email: userInfo.email,
                fullName: userInfo.name,
                isVerified: true
            });
            await userDoc.save();
            idUser = userDoc._id;

        } else { //Đã có tài khoản trong database
            idUser = checkingUserEmail._id;
        }
        const refreshTokenDoc = refreshTokenModel({
            owner: idUser,
        });
        await refreshTokenDoc.save();
        // Đã có tài khoản trong database

        const refreshToken = authService.createRefreshToken({
            email: userInfo.email,
            fullName: userInfo.name,
            _id: idUser,

        }, refreshTokenDoc.id);
        const accessToken = authService.createAccessToken({
            email: userInfo.email,
            fullName: userInfo.name,
            _id: idUser,

        });
        res.json({
            user: {
                email: userInfo.email,
                fullName: userInfo.name,
                _id: idUser
            },
            refreshToken,
            accessToken,
        })

    } catch (error) {
        res.status(400).json({ error: error.message ?? "Unknow Error" });
    }


})

exports.googleRegister = (async (req, res) => {


})