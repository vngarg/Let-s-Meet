const express = require("express");
const { RegisterUser, Login } = require("../controller/authentication");
const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/login");
});

router.get("/register", (req, res) => {
  res.render("Register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/Register", RegisterUser);
router.post("/LoginUser", Login);

router.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

module.exports = router;
