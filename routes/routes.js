const express = require("express");
const { RegisterUser } = require("../controller/authentication");
const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/register");
  // res.redirect(`/${uuidv4()}`);
});

router.get("/register", (req, res) => {
  res.render("Register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/Register", RegisterUser);

router.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

module.exports = router;
