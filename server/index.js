const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API online!" });
});

// Endpoint esempio: inoltra richiesta all'AI Engine
app.post("/analyze", async (req, res) => {
  try {
    const { text } = req.body;
    const response = await axios.post(`${process.env.AI_ENGINE_URL}/analyze`, { text });
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Errore nella comunicazione con AI Engine");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server Node.js in ascolto su porta ${PORT}`));
