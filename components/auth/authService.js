const bcrypt = require("bcrypt");
const userModel = require("./userModel");
const jwt = require("jsonwebtoken");
const refreshTokenModel = require("./refreshTokenModel");
const axios = require("axios");
exports.validPassword = (password, user) => {
    return bcrypt.compare(password, user.password);
};

exports.findByUsername = (fullName) => {
    return userModel
        .findOne({
            fullName,
        })
        .lean();
};

exports.findByEmail = (email) => {
    return userModel.findOne({ email }).lean();
};



exports.createAccessToken = ({ email, _id, fullName }) => {
    return jwt.sign({
        email,
        _id,
        fullName
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m'
    });
}

exports.createRefreshToken = ({ email, _id, fullName }, refreshTokenId) => {
    return jwt.sign({
        email,
        _id,
        fullName,
        tokenId: refreshTokenId
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '30d'
    });
}

exports.validateRefreshToken = async (token) => {
    const decodeToken = () => {
        try {
            return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        } catch (err) {
            throw new Error("Token is invalid");;
        }
    }

    const decodedToken = decodeToken();

    const tokenExists = await refreshTokenModel.exists({ _id: decodedToken.tokenId, owner: decodedToken._id });
    if (tokenExists) {
        return decodedToken;
    } else {
        throw new Error("Token is not in databse");
    }
};

exports.getGoogleUserInfo = async (token) => {
    const response = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}