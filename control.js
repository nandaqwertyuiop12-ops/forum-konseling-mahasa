const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Username atau Password salah.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Username atau Password salah.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, nama: user.nama },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '12h' }
    );

    return res.json({
      success: true,
      message: 'Login berhasil.',
      token,
      user: { id: user.id, username: user.username, nama: user.nama, role: user.role }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.parentAccess = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ success: false, message: 'Token wajib diisi.' });

  try {
    const pelanggaran = await prisma.pelanggaran.findMany({
      where: { parentToken: token.trim().toUpperCase() }
    });

    if (pelanggaran.length === 0) {
      return res.status(404).json({ success: false, message: 'Token tidak ditemukan atau tidak memiliki data pelanggaran.' });
    }

    return res.json({ success: true, data: pelanggaran });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};