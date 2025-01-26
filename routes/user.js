const { Router } = require("express");
const { createTokenForUser } = require("../services/authentication");


const router = Router();
const User = require("../models/user");

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  const user = new User({ fullName, email, password });
  await user.save();
  res.redirect("signin");
});

router.get("/signin", (req, res) => {
  res.render("signin");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userToken = await User.matchPassword(email, password);

    res.cookie("token", userToken).redirect("/");
  } catch (err) {
    console.log(err, "Error Occurred");
    res.render('signin' , {
        error: err.message
    })
}
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;
