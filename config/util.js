const Jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const PRIV_KEY = fs.readFileSync(
  path.join(__dirname, "..", "auth/keys", "id_rsa_priv.pem"),
  "utf8"
);

function issueJwt(user) {
  const id = user._id;
  const expiresIn = "1d";

  const payload = {
    sub: id,
    iat: Date.now(),
  };

  const signedPayload = Jwt.sign(payload, PRIV_KEY, {
    expiresIn: expiresIn,
    algorithm: "RS256",
  });

  return {
    token: "Bearer " + signedPayload,
    expires: expiresIn,
  };
}

module.exports = { path, issueJwt };
