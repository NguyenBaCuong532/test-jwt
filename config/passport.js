const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');
const User =require('./database') // Import your user model

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET, // Use the JWT secret from the .env file
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    console.log(1);
    try {
      // Find the user based on the JWT payload (user id in this case)
      const user = await User.findById(jwt_payload.id);
      console.log(user);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

module.exports = passport;