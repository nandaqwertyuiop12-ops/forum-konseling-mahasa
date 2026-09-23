
// ==================== NOTIFIKASI TOAST KUSTOM ====================
// Pengganti alert bawaan browser agar tidak muncul tulisan "localhost:5000"
function showToast(message) {
  let toast = document.getElementById('customToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'customToast';
    toast.className = 'fixed top-5 right-5 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 transition-all duration-300 opacity-0 transform -translate-y-2';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>🔔</span> <span>${message}</span>`;
  
  setTimeout(() => {
    toast.classList.remove('opacity-0', '-translate-y-2');
    toast.classList.add('opacity-100', 'translate-y-0');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', '-translate-y-2');
  }, 3000);
}

// ==================== STATE LOGIN & AKSES ====================
let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
let isParentLoggedIn = localStorage.getItem('isParentLoggedIn') === 'true';

// Variable Penampung Hapus Data
let pendingDeleteType = null;
let pendingDeleteId = null;

// Inisialisasi saat halaman pertama kali dimuat
document.addEventListener('DOMContentLoaded', () => {
  renderAuthArea();
  openMenu('diskusi'); // Default tampilan menu awal
});

// Helper Tampil/Sembunyi Modal Pop-up
function toggleModal(modalId, show) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  if (show) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  } else {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// Render Tombol Status Login / Logout di Top Bar
function renderAuthArea() {
  const container = document.getElementById('authArea');
  if (!container) return;

  if (isLoggedIn) {
    container.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full">👨‍🏫 Admin / Guru BK</span>
        <button type="button" onclick="handleLogout()" class="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">
          Logout
        </button>
      </div>
    `;
  } else if (isParentLoggedIn) {
    container.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full">👪 Mode Orang Tua</span>
        <button type="button" onclick="handleLogout()" class="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">
          Keluar
        </button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="flex items-center gap-2">
        <button type="button" onclick="toggleModal('parentModal', true)" class="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">
          Akses Orang Tua
        </button>
        <button type="button" onclick="toggleModal('loginModal', true)" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">
          Login Guru / Admin
        </button>
      </div>
    `;
  }
}

// Handle Process Login Guru/Admin
function handleLogin(e) {
  if (e) e.preventDefault();
  const u = document.getElementById('loginUsername')?.value;
  const p = document.getElementById('loginPassword')?.value;

  if (u === 'admin' && p === 'mahasa123-') {
    localStorage.setItem('isLoggedIn', 'true');
    isLoggedIn = true;
    toggleModal('loginModal', false);
    renderAuthArea();
    showToast('Login Berhasil sebagai Guru/Admin!');
    openMenu('diskusi');
  } else {
    showToast('Username atau Password salah!');
  }
}

// Handle Token Orang Tua (Menggunakan Token Khusus: ORTU123)
function handleParentToken(e) {
  if (e) e.preventDefault();
  const token = document.getElementById('parentTokenInput')?.value;
  
  if (token === 'ORTU123') {
    localStorage.setItem('isParentLoggedIn', 'true');
    isParentLoggedIn = true;
    toggleModal('parentModal', false);
    renderAuthArea();
    showToast('Akses Orang Tua Diverifikasi!');
    openMenu('pelanggaran');
  } else {
    showToast('Token Orang Tua tidak valid!');
  }
}

// Logout
function handleLogout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('isParentLoggedIn');
  isLoggedIn = false;
  isParentLoggedIn = false;
  renderAuthArea();
  showToast('Anda telah logout.');
  openMenu('diskusi');
}

// Helper konversi file gambar ke Base64 STRING
function getBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) resolve(null);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// ==================== HANDLER TAMBAH DATA ====================

// Handler Tambah Diskusi Publik
function handleTambahDiskusi(e) {
  if (e) e.preventDefault();
  const nama = document.getElementById('diskusiNama')?.value || 'Anonim';
  const pesan = document.getElementById('diskusiPesan')?.value;

  if (!pesan) return showToast('Pesan diskusi tidak boleh kosong!');

  const dataDiskusi = JSON.parse(localStorage.getItem('data_diskusi')) || [];
  dataDiskusi.unshift({
    id: Date.now(),
    nama: nama,
    pesan: pesan,
    tanggal: new Date().toLocaleString('id-ID')
  });

  localStorage.setItem('data_diskusi', JSON.stringify(dataDiskusi));
  showToast('Diskusi berhasil dikirim!');
  openMenu('diskusi');
}

// Handler Kirim Aduan Privat
function handleKirimAduan(e) {
  if (e) e.preventDefault();
  const nama = document.getElementById('aduanNama')?.value || 'Siswa Rahasia';
  const pesan = document.getElementById('aduanPesan')?.value;

  if (!pesan) return showToast('Pesan aduan tidak boleh kosong!');

  const dataAduan = JSON.parse(localStorage.getItem('data_aduan')) || [];
  dataAduan.unshift({
    id: Date.now(),
    nama: nama,
    pesan: pesan,
    tanggal: new Date().toLocaleString('id-ID')
  });

  localStorage.setItem('data_aduan', JSON.stringify(dataAduan));
  showToast('Aduan rahasia berhasil dikirim ke Guru BK!');
  openMenu('aduan');
}

// Handler Admin Tambah Pelanggaran
async function handleTambahPelanggaran(e) {
  if (e) e.preventDefault();
  const nama = document.getElementById('pelanggaranNama')?.value;
  const kelas = document.getElementById('pelanggaranKelas')?.value;
  const jenis = document.getElementById('pelanggaranJenis')?.value;
  const poin = document.getElementById('pelanggaranPoin')?.value;
  const fotoFile = document.getElementById('pelanggaranFoto')?.files[0];

  let fotoUrl = null;
  if (fotoFile) {
    fotoUrl = await getBase64(fotoFile);
  }

  const dataPelanggaran = JSON.parse(localStorage.getItem('data_pelanggaran')) || [];
  dataPelanggaran.unshift({
    id: Date.now(),
    namaSiswa: nama,
    kelas: kelas,
    jenisPelanggaran: jenis,
    poin: poin,
    foto: fotoUrl,
    tanggal: new Date().toLocaleDateString('id-ID')
  });

  localStorage.setItem('data_pelanggaran', JSON.stringify(dataPelanggaran));
  toggleModal('modalPelanggaran', false);
  showToast('Data Pelanggaran Berhasil Ditambahkan!');
  openMenu('pelanggaran');
}

// Handler Admin Tambah Lowongan BKK
async function handleTambahBKK(e) {
  if (e) e.preventDefault();
  const posisi = document.getElementById('bkkPosisi')?.value;
  const perusahaan = document.getElementById('bkkPerusahaan')?.value;
  const deskripsi = document.getElementById('bkkDeskripsi')?.value;
  const fotoFile = document.getElementById('bkkFoto')?.files[0];

  let fotoUrl = null;
  if (fotoFile) {
    fotoUrl = await getBase64(fotoFile);
  }

  const dataBKK = JSON.parse(localStorage.getItem('data_bkk')) || [];
  dataBKK.unshift({
    id: Date.now(),
    posisi: posisi,
    perusahaan: perusahaan,
    deskripsi: deskripsi,
    foto: fotoUrl,
    tanggal: new Date().toLocaleDateString('id-ID')
  });

  localStorage.setItem('data_bkk', JSON.stringify(dataBKK));
  toggleModal('modalBkk', false);
  showToast('Lowongan BKK Berhasil Ditambahkan!');
  openMenu('bkk');
}

// ==================== FUNGSI HAPUS DATA KUSTOM ====================

// Buka Modal Konfirmasi Hapus Kustom
function hapusData(type, id) {
  pendingDeleteType = type;
  pendingDeleteId = id;
  
  const modal = document.getElementById('confirmDeleteModal');
  const btnConfirm = document.getElementById('btnConfirmDelete');
  
  if (modal && btnConfirm) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    btnConfirm.onclick = executeDelete;
  } else {
    // Fallback jika modal HTML belum dipasang
    executeDelete();
  }
}

// Tutup Modal Konfirmasi Hapus
function closeConfirmModal() {
  const modal = document.getElementById('confirmDeleteModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  pendingDeleteType = null;
  pendingDeleteId = null;
}

// Eksekusi Penghapusan Data
function executeDelete() {
  if (!pendingDeleteType || !pendingDeleteId) return;

  const keyMap = {
    'diskusi': 'data_diskusi',
    'aduan': 'data_aduan',
    'bkk': 'data_bkk',
    'pelanggaran': 'data_pelanggaran'
  };

  const storageKey = keyMap[pendingDeleteType];
  if (storageKey) {
    let data = JSON.parse(localStorage.getItem(storageKey)) || [];
    data = data.filter(item => item.id !== pendingDeleteId);
    localStorage.setItem(storageKey, JSON.stringify(data));

    closeConfirmModal();
    showToast('Data berhasil dihapus!');
    openMenu(pendingDeleteType);
  }
}

// ==================== TAMPILAN KONTEN UTAMA ====================
function openMenu(type) {
  const container = document.getElementById('contentArea');
  if (!container) return;

  if (type === 'diskusi') {
    const listDiskusi = JSON.parse(localStorage.getItem('data_diskusi')) || [];
    container.innerHTML = `
      <div class="space-y-6">
        <div class="border-b pb-2">
          <h3 class="font-bold text-lg text-gray-800">💬 Forum Diskusi Publik</h3>
          <p class="text-xs text-gray-500">Ruang diskusi terbuka untuk seluruh siswa dan pihak sekolah.</p>
        </div>

        <!-- Form Kirim Diskusi -->
        <form onsubmit="handleTambahDiskusi(event)" class="bg-gray-50 p-4 rounded-2xl border space-y-3">
          <input type="text" id="diskusiNama" placeholder="Nama Anda / NIS (Kosongkan jika Anonim)" class="w-full p-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-blue-400 focus:outline-none">
          <textarea id="diskusiPesan" required placeholder="Tuliskan ide, pertanyaan, atau tanggapan Anda di sini..." class="w-full p-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-blue-400 focus:outline-none" rows="3"></textarea>
          <div class="flex justify-end">
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer">
              🚀 Kirim Diskusi
            </button>
          </div>
        </form>

        <!-- Daftar Posting Diskusi -->
        ${listDiskusi.length === 0 ? `<p class="text-xs text-gray-400 text-center py-6">Belum ada diskusi. Jadilah yang pertama berkomentar!</p>` : ''}
        <div class="space-y-3">
          ${listDiskusi.map(d => `
            <div class="p-4 bg-white border border-gray-100 shadow-sm rounded-2xl space-y-2">
              <div class="flex justify-between items-center">
                <span class="font-bold text-xs text-blue-600">👤 ${d.nama}</span>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] text-gray-400">${d.tanggal}</span>${isLoggedIn ? `<button type="button" onclick="hapusData('diskusi', ${d.id})" class="text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold px-2 py-0.5 rounded-lg transition cursor-pointer">🗑️ Hapus</button>` : ''}
                </div>
              </div>
              <p class="text-xs text-gray-700 leading-relaxed">${d.pesan}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (type === 'aduan') {
    const listAduan = JSON.parse(localStorage.getItem('data_aduan')) || [];
    container.innerHTML = `
      <div class="space-y-6">
        <div class="border-b pb-2">
          <h3 class="font-bold text-lg text-gray-800">🔒 Layanan Aduan & Konseling Privat</h3>
          <p class="text-xs text-gray-500">Pesan kamu bersifat rahasia dan hanya dapat dibaca oleh Guru BK / Admin.</p>
        </div>

        <!-- Form Kirim Aduan Rahasia -->
        <form onsubmit="handleKirimAduan(event)" class="bg-pink-50/50 p-4 rounded-2xl border border-pink-100 space-y-3">
          <input type="text" id="aduanNama" placeholder="Nama / Inisial Kamu (Bisa dikosongkan agar rahasia)" class="w-full p-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-pink-400 focus:outline-none">
          <textarea id="aduanPesan" required placeholder="Tuliskan masalah, keluhan, atau aduan privat kamu ke Guru BK..." class="w-full p-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-pink-400 focus:outline-none" rows="4"></textarea>
          <div class="flex justify-end">
            <button type="submit" class="bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer">
              📩 Kirim Aduan Rahasia
            </button>
          </div>
        </form>

        <!-- Daftar Aduan Masuk (KHUSUS ADMIN / GURU BK) -->
        ${isLoggedIn ? `
          <div class="space-y-3 mt-6">
            <h4 class="font-bold text-sm text-gray-700 border-b pb-1">📥 Kotak Masuk Aduan (Khusus Guru BK):</h4>
            ${listAduan.length === 0 ? `<p class="text-xs text-gray-400 py-2">Belum ada aduan masuk.</p>` : ''}
            ${listAduan.map(a => `
              <div class="p-4 bg-white border border-pink-100 shadow-sm rounded-2xl space-y-2">
                <div class="flex justify-between items-center">
                  <span class="font-bold text-xs text-pink-600">👤 ${a.nama}</span>
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] text-gray-400">${a.tanggal}</span>
                    <button type="button" onclick="hapusData('aduan', ${a.id})" class="text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold px-2 py-0.5 rounded-lg transition cursor-pointer">🗑️ Hapus</button>
                  </div>
                </div>
                <p class="text-xs text-gray-700 leading-relaxed">${a.pesan}</p>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-center space-y-1">
            <p class="text-xs text-gray-500 font-semibold">🔒 Kerahasiaan Terjamin</p>
            <p class="text-[11px] text-gray-400">Pesan aduan yang dikirim bersifat rahasia dan hanya dapat diakses oleh Admin / Guru BK yang terautentikasi.</p>
          </div>
        `}
      </div>
    `;
  } else if (type === 'bkk') {
    const listBkk = JSON.parse(localStorage.getItem('data_bkk')) || [];
    container.innerHTML = `
      <div class="space-y-4">
        <div class="flex justify-between items-center border-b pb-2">
          <h3 class="font-bold text-lg text-gray-800">🏢 Lowongan Kerja BKK</h3>
          ${isLoggedIn ? `<button type="button" onclick="toggleModal('modalBkk', true)" class="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition cursor-pointer">+ Tambah BKK</button>` : ''}
        </div>
        ${listBkk.length === 0 ? `<p class="text-xs text-gray-400 text-center py-6">Belum ada lowongan BKK tersedia.</p>` : ''}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${listBkk.map(b => `
            <div class="p-4 bg-white border border-gray-100 shadow-sm rounded-2xl space-y-2 flex flex-col justify-between">
              <div class="space-y-2">
                <div class="flex justify-between items-start">
                  <h4 class="font-bold text-blue-600 text-base">${b.posisi}</h4>${isLoggedIn ? `<button type="button" onclick="hapusData('bkk', ${b.id})" class="text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold px-2 py-1 rounded-lg transition cursor-pointer">🗑️ Hapus</button>` : ''}
                </div>
                <p class="text-xs font-semibold text-gray-700">${b.perusahaan}</p>
                <p class="text-xs text-gray-500 leading-relaxed">${b.deskripsi}</p>${b.foto ? `<img src="${b.foto}" class="mt-2 rounded-xl max-h-60 object-cover border w-full">` : ''}
              </div>
              <span class="text-[10px] text-gray-400 block mt-2 border-t pt-2">Diupload: ${b.tanggal}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (type === 'pelanggaran') {
    const listPelanggaran = JSON.parse(localStorage.getItem('data_pelanggaran')) || [];
    const hasAccess = isLoggedIn || isParentLoggedIn;

    container.innerHTML = `
      <div class="space-y-4">
        <div class="flex justify-between items-center border-b pb-2">
          <h3 class="font-bold text-lg text-gray-800">📜 Catatan Pelanggaran Siswa</h3>
          ${isLoggedIn ? `<button type="button" onclick="toggleModal('modalPelanggaran', true)" class="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition cursor-pointer">+ Tambah Pelanggaran</button>` : ''}
        </div>

        ${hasAccess ? `
          ${listPelanggaran.length === 0 ? `<p class="text-xs text-gray-400 text-center py-6">Belum ada catatan pelanggaran siswa.</p>` : ''}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${listPelanggaran.map(p => `
              <div class="p-4 bg-white border border-gray-100 shadow-sm rounded-2xl space-y-2 flex flex-col justify-between">
                <div class="space-y-2">
                  <div class="flex justify-between items-center">
                    <h4 class="font-bold text-gray-800 text-sm">${p.namaSiswa} <span class="text-xs text-gray-400 font-normal">(${p.kelas})</span></h4>
                    <span class="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">${p.poin} Poin</span>
                  </div>
                  <p class="text-xs text-gray-600">${p.jenisPelanggaran}</p>
                  ${p.foto ? `<img src="${p.foto}" class="mt-2 rounded-xl max-h-48 object-cover border w-full">` : ''}
                </div>
                <div class="flex justify-between items-center border-t pt-2 mt-2">
                  <span class="text-[10px] text-gray-400 block">Tanggal: ${p.tanggal}</span>
                  ${isLoggedIn ? `<button type="button" onclick="hapusData('pelanggaran', ${p.id})" class="text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold px-2 py-1 rounded-lg transition cursor-pointer">🗑️ Hapus</button>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center space-y-3 my-4">
            <span class="text-3xl">🔒</span>
            <h4 class="font-bold text-amber-800 text-sm">Akses Terbatas</h4>
            <p class="text-xs text-amber-700 max-w-md mx-auto leading-relaxed">
              Catatan pelanggaran siswa bersifat tertutup untuk publik. Hanya <strong>Guru / Admin</strong> dan <strong>Orang Tua Siswa</strong> yang dapat melihat data ini.
            </p>
            <div class="flex justify-center gap-3 pt-2">
              <button type="button" onclick="toggleModal('loginModal', true)" class="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer">
                Login Guru / Admin
              </button>
              <button type="button" onclick="toggleModal('parentModal', true)" class="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer">
                Akses Orang Tua
              </button>
            </div>
          </div>
        `}
      </div>
    `;
  }
}
// Memastikan fungsi dapat dipanggil langsung dari onclick HTML
window.handleLogout = handleLogout;
window.toggleModal = toggleModal;
window.handleParentToken = handleParentToken;
window.handleLogin = handleLogin;
