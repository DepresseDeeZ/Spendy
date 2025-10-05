const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing of JSON request bodies

// --- MongoDB Schema and Model ---
const trackerSchema = new mongoose.Schema({
    year: { type: Number, required: true, unique: true },
    categories: [String],
    incomeSources: [String],
    dailyExpenses: { type: Map, of: Number },
    weeklyIncomes: { type: Map, of: Number },
    budgets: { type: Map, of: Number },
    expenseLog: [Object],
    incomeLog: [Object]
});

const Tracker = mongoose.model('Tracker', trackerSchema);

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB.'))
    .catch(err => console.error('MongoDB connection error:', err));


// --- API Routes ---

// GET: Fetch tracker data for a specific year
app.get('/api/tracker/:year', async (req, res) => {
    try {
        const trackerData = await Tracker.findOne({ year: req.params.year });
        if (!trackerData) {
            return res.status(404).json({ message: 'No data found for this year.' });
        }
        res.json(trackerData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error });
    }
});

// POST: Create initial tracker data for a new year
app.post('/api/tracker', async (req, res) => {
    try {
        const existingTracker = await Tracker.findOne({ year: req.body.year });
        if (existingTracker) {
            return res.status(409).json({ message: 'Data for this year already exists.' });
        }
        const newTracker = new Tracker(req.body);
        await newTracker.save();
        res.status(201).json(newTracker);
    } catch (error) {
        res.status(500).json({ message: 'Error creating data', error });
    }
});

// PUT: Update tracker data for a specific year
app.put('/api/tracker/:year', async (req, res) => {
    try {
        const updatedData = await Tracker.findOneAndUpdate(
            { year: req.params.year },
            req.body,
            { new: true, upsert: true } // `new: true` returns the updated doc, `upsert: true` creates if not found
        );
        res.json(updatedData);
    } catch (error) {
        res.status(500).json({ message: 'Error updating data', error });
    }
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
