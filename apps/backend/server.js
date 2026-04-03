import express from "express";
import cors from "cors";
import dotenv from "dotenv"

dotenv.config()
const app = express();

const PORT = process.env.PORT;

// In-memory storage (resets when the server restarts)
let todos = [];
let nextId = 1;

// Allow the React app on port 3000 to call this API
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Parse JSON bodies on POST requests
app.use(express.json());

// GET /todos — return all todos
app.get("/todos", (req, res) => {
  res.json(todos);
});

// POST /todos — add a new todo (expects { "text": "..." })
app.post("/todos", (req, res) => {
  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";

  if (!text) {
    return res.status(400).json({ error: "Missing or empty 'text' field" });
  }

  const todo = { id: nextId++, text };
  todos.push(todo);
  res.status(201).json(todo);
});

// DELETE /todos/:id — remove a todo by id
app.delete("/todos/:id", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const before = todos.length;
  todos = todos.filter((t) => t.id !== id);

  if (todos.length === before) {
    return res.status(404).json({ error: "Todo not found" });
  }

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
