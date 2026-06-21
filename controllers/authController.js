const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// SIGNUP
const signup = async (req, res) => {
  try {
    console.log('Signup request body:', req.body);
    const { name, username, email, password, role } = req.body;

    // Accept requests with either an explicit username or derive one from `name`
    let usernameToUse = username;
    if (!usernameToUse && name) {
      // derive a safe username from name (fallback)
      usernameToUse = name.trim().toLowerCase().replace(/\s+/g, '') + (Date.now() % 1000);
    }

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields: name, email, password' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: usernameToUse.toLowerCase() }]
    });
    if (existingUser) {
      return res.status(409).json({
        message: "User with this email or username already exists"
      });
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please provide a valid email"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name: name.trim(),
      username: usernameToUse.trim().toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "staff"
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email or username already exists"
      });
    }
    console.error('Signup error:', error, 'body:', req.body);
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    console.log('Login request body:', req.body);
    const { username, email, password } = req.body;

    // Validate input
    if ((!username && !email) || !password) {
      return res.status(400).json({
        message: "Username or email and password are required"
      });
    }

    const query = username
      ? { username: username.toLowerCase() }
      : { email: email.toLowerCase() };

    console.log('Login query:', query);

    // Find user by username or email with password field
    const user = await User.findOne(query).select('+password');
    if (!user) {
      console.log('Login failed: no matching user');
      return res.status(401).json({
        message: "Invalid username/email or password"
      });
    }

    console.log('User found for login:', {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role
    });

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid username/email or password"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET || "your_default_secret_key",
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = { signup, login };
