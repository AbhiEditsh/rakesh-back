// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// App setup
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://rc:rc2025@certificate.sp1rfdx.mongodb.net", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ========================
// Mongoose Model
// ========================
const formSchema = new mongoose.Schema({
  name: String,
  contact: {
    type: String,
    unique: true, // ensures uniqueness at DB level
    required: true,
  },
});

// ========================
// Routes + Controller
// ========================

// GET: All form data
app.get("/api/forms", async (req, res) => {
  try {
    const forms = await Form.find();
    res.json(forms);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST: Create new form entry
app.post("/api/forms", async (req, res) => {
  const { name, contact } = req.body;

  if (!name || !contact) {
    return res.status(400).json({ error: "Name and Contact are required" });
  }

  try {
    const existingForm = await Form.findOne({ contact });

    if (existingForm) {
      return res
        .status(409)
        .json({ error: "This contact number is already used" });
    }

    const newForm = new Form({ name, contact });
    await newForm.save();

    res.status(201).json(newForm);
  } catch (err) {
    res.status(500).json({ error: "Failed to save data" });
  }
});

// DELETE: Delete form by ID
app.delete("/api/forms/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedForm = await Form.findByIdAndDelete(id);
    if (!deletedForm) {
      return res.status(404).json({ error: "Form not found" });
    }
    res.json({ message: "Form deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete form" });
  }
});

// ========================
// Start Server
// ========================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
