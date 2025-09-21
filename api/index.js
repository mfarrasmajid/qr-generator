// api/index.js
const app = require('../server');

// Express app adalah function (req, res, next), bisa langsung diekspor.
// Vercel akan menanganinya sebagai serverless function.
module.exports = app;