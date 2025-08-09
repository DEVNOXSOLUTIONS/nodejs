const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();

// Allow any origin (works for file:// too)
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get('/api/graduates/search', (req, res) => {
    const searchName = req.query.name?.toLowerCase();
    if (!searchName) return res.json([]);

    fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Error reading database' });

        const graduates = JSON.parse(data).graduates;
        const results = graduates.filter(g => g.Name.toLowerCase().includes(searchName));
        res.json(results);
    });
});

// Export for Vercel
module.exports = app;

// Run locally if not in serverless
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}
