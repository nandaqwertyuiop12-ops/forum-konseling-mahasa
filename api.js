const express = require('express');
const router = express.Router();

// Memanggil controller dan middleware langsung dari folder utama
const auth = require('./control');
const pelanggaran = require('./pelanggaran');
const { verifyToken, isAdmin } = require('./middlawere');

// Auth Routes
router.post('/login', auth.login);
router.post('/parent-access', auth.parentAccess);

// Pelanggaran Routes
router.get('/pelanggaran', verifyToken, pelanggaran.getAll);
router.post('/pelanggaran', verifyToken, isAdmin, pelanggaran.create);

module.exports = router;