const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const type = req.baseUrl.split('/').pop(); // 'users', 'projects', or 'characters'
        const dir = path.join(__dirname, '..', 'uploads', type);

        // create directory if it doesn't exist
        fs.mkdirSync(dir, { recursive: true });

        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// ✅ Add file size & type validation here:
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error('Only JPEG, PNG, and GIF images are allowed'), false);
        }
        cb(null, true);
    }
});

module.exports = upload;
