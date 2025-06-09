const express = require('express');
const cors = require('cors');
const userRoutes = require('./userRoutes');

const app = express();
const PORT = 5000;

app.use(cors()); // Allow frontend access
app.use(express.json());

// Route prefix: /api/users
app.use('/api/inkforge_users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
