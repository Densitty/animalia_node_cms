const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

exports.displayAbout = (req, res) => {
  res.locals.title = "About";
  res.render("home/about");
};

exports.login = (req, res) => {
  res.locals.title = "Login";
  res.render("home/login");
};

/* Passport middleware for authentication */
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email });

        if (!user)
          return done(null, false, {
            message: "User not found. Please register.",
          });

        bcrypt.compare(password, user.password, (err, matched) => {
          if (err) return err;

          if (matched) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: "Incorrect username or password",
            });
          }
        });

        user.validatePassword();
      } catch (err) {
        console.log(err);
        done(err);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
/* Passport middleware for authentication */

exports.signin = async (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
};

exports.register = (req, res) => {
  res.locals.title = "Register";
  res.render("home/register");
};

exports.signup = async (req, res) => {
  const errors = [];
  const { firstName, lastName, email, password, passwordConfirm } = req.body;

  try {
    if (!firstName) {
      errors.push({ message: "Please enter your first name." });
    }

    if (!lastName) {
      errors.push({ message: "Please enter your last name." });
    }

    if (!email) {
      errors.push({ message: "Kindly provide a valid email address." });
    }

    if (!password) {
      errors.push({ message: "Kindly provide password." });
    }

    if (!passwordConfirm || password !== passwordConfirm) {
      errors.push({
        message: "Passwords must match. Please confirm your password.",
      });
    }

    if (errors.length > 0) {
      res.render("home/register", {
        errors,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
      });
    } else {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        req.flash(
          "error_message",
          "User with that email exists. Please login."
        );

        res.redirect("/login");
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, async (err, hash) => {
            const user = await User.create({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              password: hash,
            });

            req.flash(
              "success_message",
              "You are now registered, please login."
            );
            res.redirect("/login");
          });
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

exports.logout = async (req, res) => {
  req.session.destroy();
  req.logout();
  res.redirect("/");
};
