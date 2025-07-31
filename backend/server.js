const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

dotenv.config();

const PORT = process.env.PORT;
const authRoutes = require("./routes/AuthRoutes");
const mediaRoutes = require("./routes/MediaRoutes");
const contactRoutes = require("./routes/ContactRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/contact", contactRoutes);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('MongoDB connection error: ', error)
);

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server in running on: http://localhost:${PORT}`)
})
