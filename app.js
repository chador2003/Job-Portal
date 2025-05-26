const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // ✅ Correct placement

// Other app.use and route setups
