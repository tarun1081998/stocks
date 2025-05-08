const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// In-memory list of unique stock symbols (all uppercase)
let stockList = new Set();  // Use Set to avoid duplicates automatically

// Webhook endpoint for Chartink (POST)
app.post("/chartink-webhook", (req, res) => {
    const stocks = req.body.stocks;

    if (!stocks || typeof stocks !== "string") {
        return res.status(400).json({ error: "Missing or invalid 'stocks' field." });
    }

    const symbols = stocks
        .split(",")
        .map(s => s.trim().toUpperCase())
        .filter(s => s.length > 0);

    let added = [];

    symbols.forEach(symbol => {
        if (!stockList.has(symbol)) {
            stockList.add(symbol);
            added.push(symbol);
        }
    });

    res.status(200).json({
        message: "Symbols processed.",
        added,
        total: stockList.size
    });
});

// Get all stored symbols (GET)
app.get("/stocks", (req, res) => {
    res.json({ stockList: Array.from(stockList).sort() });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});