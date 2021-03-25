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

  const userExistwithEmail = await userModel.findOne({ email });
  const userExistwithContact = await userModel.findOne({ contact });
  
  if(userExistwithContact || userExistwithEmail)
    return res.status(400).json({
      message: 'User already exists'
    })

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

exports.Login = async (req, res) => {
  const { email, password } = req.body;
  const result = await userModel.find({ email });

  if (result.length > 0) {
    if (result[0].password == password)
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
