const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); // path updated!

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/inkforge_users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
