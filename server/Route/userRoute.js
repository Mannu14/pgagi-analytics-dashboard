require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
var cors = require("cors");
const cookieParser = require("cookie-parser");
const auth = require("../src/middleware/auth");

const userController = require('../Controller/userController');
// --- google sign-up--
const passport = require('passport');
const session = require('express-session');
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
}));

require('../src/middleware/passport');
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google', passport.authenticate('google', {
    scope:
        ['email', 'profile']
}));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: `${process.env.URLFRONTENT}/auth` }),
    (req, res) => {
        const { token } = req.user;

        // Set the token as a cookie
        res.cookie('access_token', token, {
            httpOnly: true,
            // sameSite: 'None',
            secure: process.env.NODE_ENV === 'production',
        });

        // Redirect to profile page or any other page
        res.redirect(`${process.env.URLFRONTENT}/Profile`);
    }
);
// --- google sign-up End--

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
    origin: `${process.env.URLFRONTENT}`,
    credentials: true, // Include cookies in cross-origin requests
    optionsSuccessStatus: 201
}));




const Images_path = path.join(__dirname, "../public/images");
app.use(express.static(Images_path));


const multer = require('multer');

const storageprofile = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'client/dist/images');
    },
    filename: function (req, file, cb) {
        const name = file.originalname + '-' + Date.now()
        cb(null, name);
    }
});
const uploadprofile = multer({ storage: storageprofile });


app.post("/apis/register", uploadprofile.single('image'), userController.register);

app.post('/apis/login', userController.login);

app.get("/apis/NewsApi", auth.isLogin, userController.NewsApi);
app.get("/apis/Profile", auth.isLogin, userController.Profile);

app.post("/apis/update-user-profile-image", uploadprofile.single('image'), userController.updateUserProfileImage);
app.post("/apis/update-user-profile", uploadprofile.single('image'), userController.updateProfileNames);
app.post("/apis/update-Other-users-profile", uploadprofile.single('image'), userController.updateProfileOtherUsers);

const upload = multer();
app.post("/apis/Delete-Other-users-profile", upload.none(), userController.DeleteProfileOtherUsers);

app.post("/apis/NewsapiDatasend", upload.none(), userController.NewsapiDatasend);
app.get("/apis/NewsapiDataGet", userController.NewsapiDataGet);
app.post("/apis/PostNewsApistore", upload.none(), userController.PostNewsApistore);
app.get("/apis/Showstoreddata-frontend", userController.ShowStoredData);
app.get("/apis/SearchData", userController.SearchData);

app.get("/apis/logOut", userController.logOut);

app.post("/apis/subscribe", upload.none(), userController.subscribe);

app.get("/apis/keys", async (req, res) => {
    try {
        KEYS = {
            FRONTEND_APIKEY1: process.env.FRONTEND_APIKEY1,
            FRONTEND_APIKEY2: process.env.FRONTEND_APIKEY2,
        }
        res.status(200).json({ KEYS: KEYS });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});
const nodemailer = require("nodemailer");

app.post("/apis/sendemail", upload.none(), async (req, res) => {
    emailuser = req.body.email
    subject = req.body.subject
    console.log(emailuser, subject)

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false,
        auth: {
            user: process.env.useremail,
            pass: process.env.emailpass
        }
    })
    var mailOptions = {
        from: `${emailuser}`,
        to: process.env.useremail,
        subject: subject,
        html: `<p style="background: #333;padding: 10px; color: #fff;font-size: 28px; text-align: center;">Contact Us Email</p>
            <p style="padding: 10px;margin: 1px; background: #222;color: #f2f2f2; font-family: math; font-size: 20px; padding-left: 100px;">
                <strong style="color: #72f706;padding: 10px;">Name:</strong> ${req.body.name}
            </p>
            <p style="padding: 10px;margin: 1px; background: #222;color: #f2f2f2; font-family: math; font-size: 20px; padding-left: 100px;">
                <strong style="color: #72f706;padding: 10px;">Email:</strong> ${req.body.email}
            </p>
            <p style="padding: 10px;margin: 1px; background: #222;color: #f2f2f2; font-family: math; font-size: 20px; padding-left: 100px;">
                <strong style="color: #72f706;padding: 10px;">Phone Number:</strong> ${req.body.number}
            </p>
            <p style="padding: 10px;margin: 1px; background: #222;color: #f2f2f2; font-family: math; font-size: 20px; padding-left: 100px;">
                <strong style="color: #72f706;padding: 10px;">Message:</strong> ${req.body.message}
            </p>
            <p style="background: #333;padding: 10px; color: #fff;font-size: 28px; text-align: center;">From Mkcoding</p>`
    }
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log("Email Sent " + info.response);
            res.status(201).json({ msg: 'send Successfully' })
        }
    })

}
);

module.exports = app;