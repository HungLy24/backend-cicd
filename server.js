const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

let db;

async function connectDB() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db();
  console.log("✅ Connected MongoDB");
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Backend OK 🚀" });
});

app.post("/api/notes", async (req, res) => {
  const text = (req.body.text || "hello");
  const result = await db.collection("notes").insertOne({
    text,
    createdAt: new Date()
  });
  res.json(result);
});

app.get("/api/notes", async (req, res) => {
  const notes = await db.collection("notes").find().toArray();
  res.json(notes);
});

connectDB()
  .then(() => app.listen(PORT, () => {
    console.log("🚀 Server chạy ở port", PORT);
  }))
  .catch(err => {
    console.log("❌ Lỗi MongoDB:", err.message);
  });
