const router = require("express").Router();
const passport = require("../config/passport");
const { generateToken } = require("../lib/utils.js");
const connection = require("../config/database");
const User = connection.models.User;

/**
 * -------------- POST ROUTES ----------------
 */

// TODO
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  // Implement your authentication logic here (find user, check password, etc.)
  const user = await User.findOne({ username });
  if (user && user.password==password) {
    const token = generateToken(user._id); // Generate JWT token after authentication
    return res.json({ token });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});
router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: "You are authorized!", user: req.user });
  }
);
// TODO
router.post("/register", async (req, res, next) => {
  const { body } = req;
  console.log(body);

  const newUser = new User({
    username: req.body.username,
    password: req.body.password,
  });
  newUser
    .save()
    .then((user) => {})

    .catch((error) => {
      next(error);
    });
});

/**
 * -------------- GET ROUTES ----------------
 */

router.get("/", (req, res, next) => {
  res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

// When you visit http://localhost:3000/login, you will see "Login Page"
router.get("/login", (req, res, next) => {
  const form =
    '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

// When you visit http://localhost:3000/register, you will see "Register Page"
router.get("/register", (req, res, next) => {
  const form =
    '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 *
 * Also, look up what behaviour express session has without a maxage set
 */
router.get("/protected-route", (req, res, next) => {
  // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
  if (req.isAuthenticated()) {
    res.send(
      '<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>'
    );
  } else {
    res.send(
      '<h1>You are not authenticated</h1><p><a href="/login">Login</a></p>'
    );
  }
});

// Visiting this route logs the user out
router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/protected-route");
});

router.get("/login-success", (req, res, next) => {
  res.send(
    '<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
  );
});

router.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});

module.exports = router;
