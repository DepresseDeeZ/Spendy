const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET; // Use secret key from .env file

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
// Use the MONGO_URI from your .env file
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- Mongoose Schemas ---
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
});

const TrackerSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  categories: [String],
  incomeSources: [String],
  dailyExpenses: { type: Object, default: {} },
  weeklyIncomes: { type: Object, default: {} },
  budgets: { type: Object, default: {} },
  expenseLog: { type: Array, default: [] },
  incomeLog: { type: Array, default: [] },
});

// Create a compound index to ensure a user can only have one tracker per year
TrackerSchema.index({ year: 1, userId: 1 }, { unique: true });

const User = mongoose.model("User", UserSchema);
const Tracker = mongoose.model("Tracker", TrackerSchema);

// --- Auth Middleware ---
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token is required." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Add user payload to request
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

// --- API Routes ---
const router = express.Router();

// -- Auth Routes --
router.post("/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({
      message: "Server error during registration.",
      error: error.message,
    });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({ token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error during login.", error: error.message });
  }
});

// -- Tracker Routes (Protected) --
router.post("/tracker", authMiddleware, async (req, res) => {
  try {
    const { year, categories, incomeSources } = req.body;
    const userId = req.user.userId;

    const existingTracker = await Tracker.findOne({ year, userId });
    if (existingTracker) {
      return res.status(409).json({
        message: `A tracker for ${year} already exists for this user.`,
      });
    }

    const newTracker = new Tracker({ ...req.body, userId });
    await newTracker.save();
    res.status(201).json(newTracker);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create tracker.", error: error.message });
  }
});

router.get("/tracker/:year", authMiddleware, async (req, res) => {
  try {
    const { year } = req.params;
    const userId = req.user.userId;
    const tracker = await Tracker.findOne({ year: parseInt(year), userId });
    if (!tracker) {
      return res
        .status(404)
        .json({ message: "No tracker data found for this year." });
    }
    res.status(200).json(tracker);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch tracker data.", error: error.message });
  }
});

router.put("/tracker/:year", authMiddleware, async (req, res) => {
  try {
    const { year } = req.params;
    const userId = req.user.userId;
    const updatedData = req.body;

    const updatedTracker = await Tracker.findOneAndUpdate(
      { year: parseInt(year), userId },
      updatedData,
      { new: true } // Return the updated document
    );

    if (!updatedTracker) {
      return res.status(404).json({ message: "Tracker not found to update." });
    }
    res.status(200).json(updatedTracker);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update tracker data.",
      error: error.message,
    });
  }
});

app.use("/api", router);

// --- Server Start ---
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
