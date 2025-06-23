// server.js
const express = require("express");
const cors = require("cors");
const db = require("./db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json()); // per parse JSON body

// Test route semplice
app.get("/", (req, res) => {
  res.send("API Intelligent Document Analyzer Backend");
});

// API: Caricamento documento (solo metadata per ora)
app.post("/api/documents/upload", async (req, res) => {
  try {
    const { user_id, filename } = req.body;
    if (!user_id || !filename) {
      return res.status(400).json({ error: "user_id e filename sono richiesti" });
    }

    const result = await db.query(
      "INSERT INTO documents (user_id, filename) VALUES ($1, $2) RETURNING *",
      [user_id, filename]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Errore upload documento:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

// API: Recupera documento per id
app.get("/api/documents/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM documents WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Documento non trovato" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Errore get documento:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

// API: Lista documenti con paginazione semplice
app.get("/api/documents", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await db.query(
      "SELECT * FROM documents ORDER BY upload_date DESC LIMIT $1 OFFSET $2",
      [limit, offset]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Errore lista documenti:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

// API: Richiedi analisi documento (dummy, solo update stato)
app.post("/api/documents/:id/analyze", async (req, res) => {
  try {
    const { id } = req.params;

    // Qui chiamerai l'AI engine per l'analisi, ma per ora solo dummy
    // Aggiorna lo stato
    const result = await db.query("UPDATE documents SET status = $1 WHERE id = $2 RETURNING *", [
      "analysing",
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Documento non trovato" });
    }

    res.json({ message: "Analisi richiesta", document: result.rows[0] });
  } catch (error) {
    console.error("Errore analisi documento:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
