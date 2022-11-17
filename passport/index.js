const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userService = require("../components/auth/authService");

const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        session: false
    }, async function (email, password, done) {
        const user = await userService.findByEmail(email);
        if (!user) return done(null, false, { message: "Account not found" });
        const isValid = await userService.validPassword(password, user);
        if (!isValid) {
            return done(null, false, { message: "Incorrect password" });
        }
        if (!user.isVerified) return done(null, false, { message: "Please verify your email address" });
        return done(null, user);
    })
);


const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.ACCESS_TOKEN_SECRET;
passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    done(null, jwt_payload);
}))


module.exports = passport;
