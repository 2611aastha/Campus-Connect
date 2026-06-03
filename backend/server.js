const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/campus_connect")
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

// Schema
const eventSchema = new mongoose.Schema({
    event_id: String,
    title: String,
    club: String,
    location: String,
    date: Date,
    time: String,
    status: String,
    tags: [String],
    participants: [String]
});

// ✅ INDEXING (MOVED BEFORE MODEL — IMPORTANT)
eventSchema.index({ date: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ club: 1 });
eventSchema.index({ tags: 1 });

// Model
const Event = mongoose.model("Event", eventSchema);

const noticeSchema = new mongoose.Schema({
    notice_id: String,
    title: String,
    department: String,
    date: Date,
    priority: String,   // High / Medium / Low
    content: String
});

// INDEXING
noticeSchema.index({ date: 1 });
noticeSchema.index({ priority: 1 });
noticeSchema.index({ department: 1 });

const Notice = mongoose.model("Notice", noticeSchema);

// LOST & FOUND SCHEMA
const lostFoundSchema = new mongoose.Schema({
    item_name: String,
    description: String,
    location: String,
    date: Date,
    status: String, // Lost / Found
    contact: String
});

// INDEXING
lostFoundSchema.index({ status: 1 });
lostFoundSchema.index({ date: 1 });

// MODEL
const LostFound = mongoose.model("LostFound", lostFoundSchema);

// RIDE SHARE SCHEMA
const rideSchema = new mongoose.Schema({
    from: String,
    to: String,
    datetime: Date,
    seats: Number,
    contact: String
});

// INDEXING
rideSchema.index({ datetime: 1 });

// MODEL
const Ride = mongoose.model("Ride", rideSchema);

// ================= POLL SCHEMA =================

const pollSchema = new mongoose.Schema({
    poll_id: String,
    votes: [Number] // [vote1, vote2, vote3, vote4]
});

// MODEL
const Poll = mongoose.model("Poll", pollSchema);
// Test Route
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

// GET ALL EVENTS
app.get("/events", async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: "Error fetching events" });
    }
});

// CREATE NEW EVENT
app.post("/events", async (req, res) => {
    try {
        const eventData = req.body;

// AUTO STATUS LOGIC (FIXED VERSION)

const eventDate = new Date(eventData.date);
const today = new Date();

// Normalize BOTH dates to midnight
eventDate.setHours(0, 0, 0, 0);
today.setHours(0, 0, 0, 0);

if (eventDate < today) {
    eventData.status = "Completed";
} else {
    eventData.status = "Upcoming";
}

const newEvent = new Event(eventData);
        await newEvent.save();
        res.json({ message: "Event added successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 🔥 FILTER BY STATUS
app.get("/events/status/:status", async (req, res) => {
    try {
        const events = await Event.find({ status: req.params.status });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: "Error fetching by status" });
    }
});

// 🔥 FILTER BY CLUB
app.get("/events/club/:club", async (req, res) => {
    try {
        const events = await Event.find({ club: req.params.club });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: "Error fetching by club" });
    }
});

// 🔥 FILTER BY DATE RANGE
app.get("/events/date", async (req, res) => {
    try {
        const { start, end } = req.query;

        const events = await Event.find({
            date: {
                $gte: new Date(start),
                $lte: new Date(end)
            }
        });

        res.json(events);
    } catch (err) {
        res.status(500).json({ error: "Error fetching by date" });
    }
});

app.get("/analytics/events-per-club", async (req, res) => {
    try {
        const result = await Event.aggregate([
            {
                $group: {
                    _id: "$club",
                    totalEvents: { $sum: 1 }
                }
            },
            {
                $sort: { totalEvents: -1 }
            }
        ]);

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Aggregation error" });
    }
});

app.get("/analytics/status-count", async (req, res) => {
    try {
        const result = await Event.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Aggregation error" });
    }
});

app.get("/analytics/events-per-month", async (req, res) => {
    try {
        const result = await Event.aggregate([
            {
                $group: {
                    _id: { $month: "$date" },
                    totalEvents: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]);

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Aggregation error" });
    }
});

app.get("/notices", async (req, res) => {
    try {
        const notices = await Notice.find();
        res.json(notices);
    } catch (err) {
        res.status(500).json({ error: "Error fetching notices" });
    }
});



app.post("/notices", async (req, res) => {
    try {
        const newNotice = new Notice(req.body);
        await newNotice.save();
        res.json({ message: "Notice added successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// NOTICE ANALYTICS — PRIORITY COUNT

app.get("/analytics/notices-priority", async (req, res) => {

    try {

        const stats = await Notice.aggregate([

            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 }
                }
            }

        ]);

        res.json(stats);

    }

    catch (error) {

        console.error("Analytics error:", error);

        res.status(500).json({
            message: "Analytics failed"
        });

    }

});

app.get("/notices/priority/:priority", async (req, res) => {
    try {
        const notices = await Notice.find({ priority: req.params.priority });
        res.json(notices);
    } catch (err) {
        res.status(500).json({ error: "Error filtering notices" });
    }
});

app.get("/analytics/notices-priority", async (req, res) => {
    try {
        const result = await Notice.aggregate([
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Aggregation error" });
    }
});

// ================= LOST & FOUND ROUTES =================

// GET ALL ITEMS
app.get("/lostfound", async (req, res) => {
    try {
        const data = await LostFound.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Error fetching items" });
    }
});

// ADD ITEM
app.post("/lostfound", async (req, res) => {
    try {
        const item = new LostFound(req.body);
        await item.save();
        res.json({ message: "Item added successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= RIDE SHARE ROUTES =================

// GET RIDES
app.get("/rides", async (req, res) => {
    try {
        const rides = await Ride.find();
        res.json(rides);
    } catch (err) {
        res.status(500).json({ error: "Error fetching rides" });
    }
});

// POST RIDE
app.post("/rides", async (req, res) => {
    try {
        const ride = new Ride(req.body);
        await ride.save();
        res.json({ message: "Ride added successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= INIT POLLS =================

app.get("/init-polls", async (req, res) => {
    const polls = ["poll1", "poll2", "poll3", "poll4", "poll5"];

    for (let id of polls) {
        const exists = await Poll.findOne({ poll_id: id });

        if (!exists) {
            await new Poll({
                poll_id: id,
                votes: [0, 0, 0, 0]
            }).save();
        }
    }

    res.send("Polls initialized");
});

// ================= POLL ROUTES =================

// GET ALL POLLS
app.get("/polls", async (req, res) => {
    try {
        const polls = await Poll.find();
        res.json(polls);
    } catch (err) {
        res.status(500).json({ error: "Error fetching polls" });
    }
});

// CREATE POLL (only if not exists)
app.post("/polls/init", async (req, res) => {
    try {
        const existing = await Poll.findOne({ poll_id: req.body.poll_id });

        if (!existing) {
            const poll = new Poll({
                poll_id: req.body.poll_id,
                votes: [0, 0, 0, 0]
            });
            await poll.save();
        }

        res.json({ message: "Poll ready" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// VOTE
app.post("/polls/vote", async (req, res) => {
    try {
        const { poll_id, optionIndex } = req.body;

        const poll = await Poll.findOne({ poll_id });

        if (!poll) {
            return res.status(404).json({ error: "Poll not found" });
        }

        poll.votes[optionIndex]++;
        await poll.save();

        res.json(poll);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start Server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});