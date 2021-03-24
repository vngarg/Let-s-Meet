const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const users = new Schema({
    name: String,
    contact: Number,
    email: String,
    password: String
})
const userModel = mongoose.model("User", users);

export const RegisterUser = async () => {
    const name = document.querySelector(".fullName").value;
    const contact = document.querySelector('.contact').value;
    const email = document.querySelector('.email').value;
    const password = document.querySelector('.password');

    const data = {
        name, contact, email, password
    }

    const user = userModel(data);
    await user.save();
}