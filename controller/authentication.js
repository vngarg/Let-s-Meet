const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to database.");
});

const Schema = mongoose.Schema;
const users = new Schema({
  name: String,
  contact: {
    unique: true,
    type: Number,
  },
  email: {
    unique: true,
    type: String,
  },
  password: String,
});
const userModel = mongoose.model("User", users);

exports.RegisterUser = async (req, res) => {
  const { name, contact, email, password } = req.body;

  if (!name || !contact || !email || !password)
    return res.status(400).json({
      message: "Invalid data.",
    });

  const data = {
    name,
    contact,
    email,
    password,
  };

  const user = userModel(data);
  await user.save();
  return res.status(200).json({
    message: "Data saved successfully",
    data: {
      name,
    },
  });
};
