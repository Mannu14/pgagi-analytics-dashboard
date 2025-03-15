require('dotenv');
const passport = require('passport');
const Register = require("../model/user");
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const jwt = require('jsonwebtoken');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.URLFRONTENT}/auth/google/callback`,
    scope: ['email', 'profile']
},
    async (request, accessToken, refreshToken, profile, done) => {
        try {
            let GoogleUser = await Register.findOne({ email: profile.emails[0].value });
            if (!GoogleUser) {
                GoogleUser = new Register({
                    firstname: profile.given_name + profile.id.slice(-3),
                    lastname: profile.family_name,
                    email: profile.emails[0].value,
                    phone: profile.id,
                    password: 'profile.password',
                    confirmpassword: 'profile.confirmpassword',
                    image: profile.photos[0].value,
                    language: 'specify your language',
                    address: 'specify your Address',
                });
                await GoogleUser.save();
            }
            
            // Generate token
            const token = jwt.sign(
                { id: GoogleUser._id },
                process.env.SECRET_KEY,
                { expiresIn: '1h' } // Token expires in 1 hour
            );

            return done(null, { user: GoogleUser, token });
        } catch (error) {
            return done(error, null);
        }
    }
));

passport.serializeUser((data, done) => {
    done(null, data.user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});
