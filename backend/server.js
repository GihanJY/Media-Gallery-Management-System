const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");

// todo: add env
const PORT = 5000;
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server in running on: http://localhost:${PORT}`)
})
