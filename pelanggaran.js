const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function generateParentToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = 'PB-';
  for (let i = 0; i < 4; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

exports.getAll = async (req, res) => {
  try {
    const data = await prisma.pelanggaran.findMany({ orderBy: { createdAt: 'desc' } });
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { namaSiswa, kelas, jenisPelanggaran, poin, tanggal } = req.body;
    const fotoBukti = req.file ? `/uploads/${req.file.filename}` : null;
    const parentToken = generateParentToken();

    const data = await prisma.pelanggaran.create({
      data: {
        namaSiswa,
        kelas,
        jenisPelanggaran,
        poin: parseInt(poin),
        tanggal: new Date(tanggal),
        fotoBukti,
        parentToken
      }
    });

    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};