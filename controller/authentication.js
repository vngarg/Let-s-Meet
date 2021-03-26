const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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

const salt = 10;

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
  var { name, contact, email, password } = req.body;

  const userExistwithEmail = await userModel.findOne({ email });
  const userExistwithContact = await userModel.findOne({ contact });

  if (userExistwithContact || userExistwithEmail)
    return res.status(400).json({
      message: "User already exists",
    });

  if (!name || !contact || !email || !password)
    return res.status(400).json({
      message: "Invalid data.",
    });

  bcrypt
    .hash(password, salt)
    .then(async function (hash) {
      const data = {
        name,
        contact,
        email,
        password: hash,
      };

      const user = userModel(data);
      await user.save();
      return res.status(200).json({
        message: "Data saved successfully",
        data: {
          name,
        },
      });
    })
    .catch((error) => {
      return res.status(400).json({
        message: "Cannot save the data.",
      });
    });
};

exports.Login = async (req, res) => {
  const { email, password } = req.body;
  const result = await userModel.find({ email });

  if (result.length > 0) {
    const match = await bcrypt.compare(password, result[0].password);
    if (match)
      return res.status(200).json({
        message: "User found",
        data: {
          name: result[0].name,
        },
      });
  }

  return res.status(400).json({
    message: "User not found",
  });
};
