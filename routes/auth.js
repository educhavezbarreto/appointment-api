const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const authRouter = require("express").Router();
const googleAuthRouter = require("express").Router();
const {
  models: { User },
} = require("../db");

const BASE_URL = process.env.BASE_URL || "";

passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser(async (_id, done) => {
  try {
    const user = await User.findById(_id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: BASE_URL + "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ googleId: profile.id });
        if (!user) {
          const newUser = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            image: profile.photos[0].value,
            accessToken,
          });
          done(null, newUser);
        }
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

googleAuthRouter
  .get(
    "/",
    (req, res, next) => {
      if (req.user) res.redirect(BASE_URL + "/user");
      else next();
    },
    passport.authenticate("google", { scope: ["profile"] })
  )
  .get(
    "/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
      res.redirect(BASE_URL + "/user");
    }
  );

authRouter.use("/google", googleAuthRouter);

module.exports = authRouter;
