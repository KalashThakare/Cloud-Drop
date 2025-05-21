import express from "express";
import { signup,login,logout, checkAuth } from "../controller/auth.Controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import passport from "passport";

const router  = express.Router();

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

router.get("/check",protectRoute,checkAuth);

// OAuth2.0

router.get("/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/Auth",
    session: true,
    scope: ["profile", "email"]
  }),
  (req, res) => {
    res.redirect("http://localhost:3000/Main?useDefault=true");
  }
);

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.clearCookie("connect.sid");
    res.redirect("http://localhost:3000");
  });
});

router.get("/current-user", (req, res) => {
  res.json(req.user || null);
});

export default router;