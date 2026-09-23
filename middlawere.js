
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'mahasa-secret-key-2026';

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Akses ditolak, token tidak ditemukan' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Token tidak valid' });
    }
    req.user = user;
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'GURU')) {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Akses khusus Admin/Guru' });
  }
}

module.exports = {
  verifyToken,
  isAdmin
};