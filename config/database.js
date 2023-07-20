const Mongoose = require("mongoose");

connectDB();

async function connectDB() {
  await Mongoose.connect(process.env.DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).catch((err) => console.error(err));
}

const userSchema = new Mongoose.Schema({
  username: String,
  password: String,
});

const User = new Mongoose.model("user", userSchema);

module.exports = User;
