const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3005;

const DB_FILE = './users.json';

app.use(express.json());

const readDatabase = () => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const writeDatabase = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
};

app.get('/', (req, res) => {
  res.json({
    message: `Servidor en ejecucion en el puerto ${PORT}`,
    status: 200
  });
});

app.get('/users', (req, res) => {
  const users = readDatabase();
  res.json(users);
});

app.post('/users', (req, res) => {
  const users = readDatabase();
  const newUser = req.body;

  if (!newUser.id || !newUser.name || !newUser.email) {
    return res.status(400).json({ error: 'ID, name, and email are required' });
  }

  if (users.some((user) => user.id === newUser.id)) {
    return res.status(400).json({ error: 'User with the same ID already exists' });
  }

  users.push(newUser);
  writeDatabase(users);

  res.status(201).json({ message: 'User created successfully', user: newUser });
});

app.put('/users/:id', (req, res) => {
  const users = readDatabase();
  const userId = req.params.id;
  const updatedUser = req.body;

  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users[userIndex] = { ...users[userIndex], ...updatedUser };
  writeDatabase(users);

  res.json({ message: 'User updated successfully', user: users[userIndex] });
});

app.delete('/users/:id', (req, res) => {
  const users = readDatabase();
  const userId = req.params.id;

  const filteredUsers = users.filter((user) => user.id !== userId);

  if (filteredUsers.length === users.length) {
    return res.status(404).json({ error: 'User not found' });
  }

  writeDatabase(filteredUsers);

  res.json({ message: 'User deleted successfully' });
});

app.get('/users/:id', (req, res) => {
  const users = readDatabase();
  const userId = req.params.id;

  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ user });
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
  });
}
