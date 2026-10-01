const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 80;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Inicializar SQLite sincrónico
const db = new Database('./database.sqlite');

// Crear tabla
db.exec(`
  CREATE TABLE IF NOT EXISTS nombres (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
  )
`);

// --- RUTAS API ---
app.get('/api/nombres', (req, res) => {
  const rows = db.prepare('SELECT * FROM nombres ORDER BY id DESC').all();
  res.json(rows);
});

app.post('/api/nombres', (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Nombre requerido' });

  const info = db.prepare('INSERT INTO nombres (nombre) VALUES (?)').run(nombre);
  res.json({ id: info.lastInsertRowid, nombre });
});

app.put('/api/nombres/:id', (req, res) => {
  const { nombre } = req.body;
  const { id } = req.params;

  const info = db.prepare('UPDATE nombres SET nombre = ? WHERE id = ?').run(nombre, id);
  res.json({ updated: info.changes });
});

app.delete('/api/nombres/:id', (req, res) => {
  const { id } = req.params;

  const info = db.prepare('DELETE FROM nombres WHERE id = ?').run(id);
  res.json({ deleted: info.changes });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://www.server.yaelito`);
});