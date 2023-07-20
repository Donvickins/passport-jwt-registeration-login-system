const Passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const fs = require("fs");
const User = require("../config/database");
const { path } = require("../config/util");

const filePath = path.join(__dirname, "keys", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(filePath, "utf8");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};

Passport.use(
  new JwtStrategy(options, (payload, cb) => {
    User.findOne({ _id: payload.sub }).then((user) => {
      if (!user) {
        return cb(null, false, { message: "Not Found" });
      } else {
        return cb(null, user);
      }
    });
  })
);

module.exports = Passport;
