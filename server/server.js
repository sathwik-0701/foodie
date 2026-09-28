require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Connect Database asynchronously
connectDB();

app.listen(PORT, () => {
  console.log(`[Foodie Server] Running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
