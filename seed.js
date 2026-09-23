const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // Password Hash secara terenkripsi (Aman)
  const hashedAdminPassword = await bcrypt.hash('mahasa123-', 10);
  const hashedSiswaPassword = await bcrypt.hash('MAHASA', 10);

  // Create Admin
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedAdminPassword,
      nama: 'Guru Bimbingan Konseling (BK)',
      role: 'ADMIN'
    }
  });

  // Create Sample Student
  await prisma.user.upsert({
    where: { username: 'Ahmad Rizky' },
    update: {},
    create: {
      username: 'Ahmad Rizky',
      password: hashedSiswaPassword,
      nama: 'Ahmad Rizky',
      kelas: 'XI TKJ 1',
      role: 'SISWA'
    }
  });

  console.log('✅ Seed Data Default Login Berhasil Dibuat!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());