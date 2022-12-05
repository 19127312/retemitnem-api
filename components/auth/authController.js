const authService = require("./authService");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const userModel = require("./userModel");
const refreshTokenModel = require("./refreshTokenModel");
const verifyToken = require("./verifyTokenModel");
const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
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
      await userDoc.save(function (err) {
        if (err) {
          return res.status(500).send({ msg: err.message });
        }
        const token = new verifyToken({
          _userId: userDoc._id,
          token: crypto.randomBytes(16).toString("hex"),
        });
        token.save(function (err) {
          if (err) {
            return res.status(500).send({ msg: err.message });
          }
          const msg = {
            to: email, // Change to your recipient
            from: "retemitnem@gmail.com", // Change to your verified sender
            subject: "Account Verification Link",
            text: "Hello",
            html:
              "<strong>Hello " +
              fullName +
              ",\n\n" +
              "Please verify your account by clicking the link: \nhttp://" +
              req.headers.host +
              "/auth/confirmation/" +
              email +
              "/" +
              token.token +
              "\n\nThank You!\n</strong>",
          };

          sgMail
            .send(msg)
            .then(() => {
              return res.status(200).json({
                message:
                  "Account created. Please activate your account in email to continue",
              });
            })
            .catch((error) => {
              console.error(error);
              return res.status(500).send({
                msg: "Technical Issue!, Please click on resend for verify your Email.",
              });
            });
        });
      });
    } else {
      res.status(400).json({ error: "This email address is already used" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message ?? "Unknow Error" });
  }
};

exports.confirmation = async (req, res) => {
  const { email, token } = req.params;
  const confirmToken = await authService.findToken(token);
  if (!confirmToken) {
    return res.status(400).json({ error: "Invalid Token" });
  } else {
    const user = await authService.findByEmail(email);
    if (!user) {
      return res.status(400).json({ error: "Invalid Email" });
    } else {
      if (user.isVerified) {
        return res.status(400).json({ error: "User already verified" });
      } else {
        user.isVerified = true;
        await authService.updateUser(user);
        await authService.deleteToken(token);
        if (req.get("host") === "localhost:3000") {
          return res.redirect("http://localhost:3001");
        } else {
          return res.redirect("https://retemitnem.vercel.app");
        }
      }
    }
  }
};
exports.loginSuccess = async (req, res) => {
  const { email, _id, fullName } = req.user;

  const refreshTokenDoc = refreshTokenModel({
    owner: _id,
  });
  await refreshTokenDoc.save();

  const refreshToken = authService.createRefreshToken(
    {
      email,
      _id,
      fullName,
    },
    refreshTokenDoc.id
  );
  const accessToken = authService.createAccessToken({
    email,
    _id,
    fullName,
  });

  res.json({
    user: {
      email,
      fullName,
      _id,
    },
    refreshToken,
    accessToken,
  });
};

exports.createNewRefreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const currentRefreshToken = await authService.validateRefreshToken(
      refreshToken
    );
    const refreshTokenDoc = refreshTokenModel({
      owner: currentRefreshToken._id,
    });

    await refreshTokenDoc.save();
    await refreshTokenModel.deleteOne({ _id: currentRefreshToken.tokenId });

    const newRefreshToken = authService.createRefreshToken(
      {
        email: currentRefreshToken.email,
        _id: currentRefreshToken._id,
        fullName: currentRefreshToken.fullName,
      },
      refreshTokenDoc.id
    );
    const newAccessToken = authService.createAccessToken({
      email: currentRefreshToken.email,
      _id: currentRefreshToken._id,
      fullName: currentRefreshToken.fullName,
    });

    res.json({
      user: {
        email: currentRefreshToken.email,
        fullName: currentRefreshToken.fullName,
        _id: currentRefreshToken._id,
      },
      refreshToken: newRefreshToken,
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(400).json({ error: error.message ?? "Unknow Error" });
  }
};

exports.createNewAccessToken = async (req, res) => {
  try {
    const refreshToken = await authService.validateRefreshToken(
      req.body.refreshToken
    );
    const accessToken = authService.createAccessToken({
      email: refreshToken.email,
      _id: refreshToken._id,
      fullName: refreshToken.fullName,
    });
    res.json({
      user: {
        email: refreshToken.email,
        _id: refreshToken._id,
        fullName: refreshToken.fullName,
      },
      accessToken,
      refreshToken: req.body.refreshToken,
    });
  } catch (error) {
    res.status(400).json({ error: error.message ?? "Unknow Error" });
  }
};
exports.logout = async (req, res) => {
  try {
    const refreshToken = await authService.validateRefreshToken(
      req.body.refreshToken
    );
    await refreshTokenModel.deleteOne({ _id: refreshToken.tokenId });
    res.json({ message: "Logout successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message ?? "Unknow Error" });
  }
};
exports.logoutAll = async (req, res) => {
  try {
    const refreshToken = await authService.validateRefreshToken(
      req.body.refreshToken
    );
    await refreshTokenModel.deleteMany({ _id: refreshToken.tokenId });
    res.json({ message: "Logout successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message ?? "Unknow Error" });
  }
};

exports.googleLogin = async (req, res) => {
  const { token } = req.body;
  try {
    const userInfo = await authService.getGoogleUserInfo(token);
    const checkingUserEmail = await authService.findByEmail(userInfo.email);
    console.log(userInfo);
    let idUser = null;
    let fullNameUser = null;
    // Chưa có tài khoản trong databse
    if (!checkingUserEmail) {
      const userDoc = userModel({
        email: userInfo.email,
        fullName: userInfo.name,
        isVerified: true,
      });
      await userDoc.save();
      idUser = userDoc._id;
      fullNameUser = userDoc.fullName;
    } else {
      //Đã có tài khoản trong database
      idUser = checkingUserEmail._id;
      fullNameUser = checkingUserEmail.fullName;
    }
    const refreshTokenDoc = refreshTokenModel({
      owner: idUser,
    });
    await refreshTokenDoc.save();
    // Đã có tài khoản trong database

    const refreshToken = authService.createRefreshToken(
      {
        email: userInfo.email,
        fullName: fullNameUser,
        _id: idUser,
      },
      refreshTokenDoc.id
    );
    const accessToken = authService.createAccessToken({
      email: userInfo.email,
      fullName: fullNameUser,
      _id: idUser,
    });
    res.json({
      user: {
        email: userInfo.email,
        fullName: fullNameUser,
        _id: idUser,
      },
      refreshToken,
      accessToken,
    });
  } catch (error) {
    res.status(400).json({ error: error.message ?? "Unknow Error" });
  }
};
