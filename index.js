const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const exphbs = require("express-handlebars").engine;
const Handlebars = require("handlebars");
const app = express();
const methodOverride = require("method-override");
const upload = require("express-fileupload");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

/* to disable access denial on properties of object on handlebars */
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
/* helper functions */
const {
  select,
  generateTime,
  paginate,
  frontpagePostSlicer,
} = require("./utilities/handlebar_helpers");

/* Config Variables and Port */
dotenv.config({ path: `${__dirname}/./config/config.env` });
const PORT = process.env.PORT || 4000;

/* Connect to DB */
// const startDB = async function () {
//   try {
//     const conn = await mongoose.connect(process.env.DB_URL);
//     console.log(conn.connections);
//     console.log("Connection to DB established");
//   } catch (err) {
//     console.log("Connection could not be established");
//     console.log(err);
//   }
// };

// startDB();
mongoose
  .connect(process.env.CONNECTION_URI)
  // .connect(process.env.DB_URL)
  .then((con) => {
    // console.log(con);
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log(err);
  });

/* Define Routes */
const mainRoutes = require("./routes/home/main");
const adminRoutes = require("./routes/admin/admin-main");
const postsRoutes = require("./routes/admin/posts");
const categoriesRoutes = require("./routes/admin/categories");
const commentRoutes = require("./routes/admin/comments");
const generalCommentRoutes = require("./routes/home/comments");

const { userAuthenticated } = require("./utilities/authentication");
/* Routes End */

/* set the views engine */
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "home",
    helpers: {
      selectHelper: select,
      generateTime,
      paginate,
      frontpagePostSlicer,
    },
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/views"));

/* Middlewares */
/* Data Sanitization against NoSQL query injection */
app.use(mongoSanitize());
app.use(xss());
// Session Middleware
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

/* clear all cache; disable back-btn on client from allowing protected routes to be seen again after logout */
app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});
// Flash Middleware
app.use(flash());

// Authentication Middleware using Passport
app.use(passport.initialize());
app.use(passport.session());

// middleware for sending flash message using Local variables
app.use((req, res, next) => {
  // get the details of the logged-in user
  res.locals.user = req.user || null;

  // flash success message on signup
  res.locals.success_message = req.flash("success_message");

  // duplicate email error flash message on signup
  res.locals.error_message = req.flash("error_message");

  // flash error message on forms
  // res.locals.form_errors = req.flash("form_errors");

  // passport flash error on login
  res.locals.error = req.flash("error");

  next();
});
// Upload Middleware
app.use(upload());
// Body-Parsers
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));
/* Method Override */
app.use(methodOverride("_method"));

/* load statics files together with the views engine */
app.use(express.static(path.join(__dirname, "public")));

/* Routes */
app.use("/", mainRoutes);
app.use("/admin", userAuthenticated, adminRoutes);
app.use("/admin/posts", userAuthenticated, postsRoutes);
app.use("/admin/categories", userAuthenticated, categoriesRoutes);
app.use("/admin/comments", userAuthenticated, commentRoutes);
app.use("/comments", generalCommentRoutes);

app.listen(PORT, () => {
  console.log("Starting our app on port " + PORT);
});
