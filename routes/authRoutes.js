const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/authController");

// Simple logger for auth route hits
router.use((req, res, next) => {
  console.log(`[authRoutes] ${req.method} ${req.path}`);
  next();
});

router.get('/', (req, res) => {
  console.log('[authRoutes] GET /');
  res.json({ message: 'Auth route is active. Use /signup or /login.' });
});

router.post("/signup", (req, res, next) => {
  console.log('[authRoutes] POST /signup called');
  return signup(req, res, next);
});

router.post("/login", (req, res, next) => {
  console.log('[authRoutes] POST /login called');
  return login(req, res, next);
});

module.exports = router;