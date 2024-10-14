const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Simulated data (replace this with actual Google Sheets API call later)
const wowProgress = [
  { boss: "Eranog", progress: 75 },
  { boss: "Terros", progress: 60 },
  { boss: "The Primal Council", progress: 45 },
  { boss: "Sennarth, The Cold Breath", progress: 30 },
  { boss: "Dathea, Ascended", progress: 15 }
];

app.use(express.static('public'));

app.get('/api/progress', (req, res) => {
  // TODO: Add authentication check here
  res.json(wowProgress);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});