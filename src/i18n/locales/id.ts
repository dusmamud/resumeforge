import type { Dict } from './en';
import { BRAND } from '../../brand';

const id: Dict = {
  dir: 'ltr' as 'ltr' | 'rtl',
  meta: {
    siteName: BRAND.name,
    landingTitle: `${BRAND.name} — Buat Resume & CV 100% Gratis`,
    landingDescription: `${BRAND.name} adalah pembuat resume online gratis. Isi detail Anda, pilih template, dan unduh resume profesional sebagai PDF — tanpa daftar. Data Anda tidak pernah meninggalkan browser Anda.`,
    builderTitle: `Buat Resume — ${BRAND.name}`,
    builderDescription: `Buat resume Anda dengan pembuat resume gratis ${BRAND.name}. Berbagai template, pratinjau langsung, unduh PDF instan. Tanpa akun, tanpa biaya.`,
    aboutTitle: `Tentang — ${BRAND.name}`,
    aboutDescription: `Apa itu ${BRAND.name} dan mengapa resume yang rapi dan terstruktur memberi Anda lebih banyak panggilan wawancara.`,
    privacyTitle: `Kebijakan Privasi — ${BRAND.name}`,
    privacyDescription: `Kebijakan privasi ${BRAND.name}: data resume Anda tetap di browser Anda. Tidak ada yang diunggah.`,
  },
  nav: {
    home: 'Beranda',
    builder: 'Buat Resume',
    about: 'Tentang',
    theme: 'Tema',
    themeLight: 'Terang',
    themeDark: 'Gelap',
    themeSystem: 'Sistem',
    language: 'Bahasa',
    createNow: 'Buat Sekarang',
  },
  hero: {
    badge: '100% Gratis · Tanpa Daftar · Privat Secara Desain',
    titleA: 'Buat',
    titleHighlight: 'Resume 100% Gratis',
    titleB: '& CV',
    subtitle:
      'Buat resume profesional dalam hitungan menit. Isi detail Anda, pilih template, dan unduh resume sebagai PDF — sepenuhnya gratis, tanpa akun.',
    ctaPrimary: 'Buat Sekarang — gratis',
    ctaSecondary: 'Cara kerja',
  },
  steps: {
    title: 'Buat resume Anda dalam 3 langkah mudah',
    subtitle: 'Tidak perlu keahlian desain — cukup ikuti alurnya.',
    items: [
      {
        title: 'Klik Buat Sekarang',
        text: 'Mulai resume baru dengan satu klik. Pilih salah satu template kami yang rapi dan profesional untuk memulai.',
      },
      {
        title: 'Isi detail Anda',
        text: 'Tambahkan info kontak, pengalaman kerja, pendidikan, dan keterampilan. Semuanya tersimpan otomatis di browser Anda.',
      },
      {
        title: 'Unduh PDF Anda',
        text: 'Pratinjau resume Anda secara langsung, sempurnakan, dan unduh PDF siap cetak — gratis selamanya.',
      },
    ],
  },
  why: {
    title: 'Mengapa memilih kami',
    subtitle: 'Semua yang Anda butuhkan untuk resume yang menghasilkan wawancara.',
    items: [
      {
        icon: 'ph:gift',
        title: '100% Gratis',
        text: 'Setiap fitur gratis, selamanya. Tanpa paket premium, tanpa template terkunci, tanpa watermark di PDF Anda.',
      },
      {
        icon: 'ph:cursor-click',
        title: 'Mudah Digunakan',
        text: 'Formulir terpandu yang sederhana mengerjakan semuanya. Jika Anda bisa mengetik, Anda bisa membuat resume hebat di sini.',
      },
      {
        icon: 'ph:sliders-horizontal',
        title: 'Kustomisasi Sederhana',
        text: 'Ganti template, ubah warna aksen dan font, serta aktifkan atau nonaktifkan bagian dengan satu klik.',
      },
      {
        icon: 'ph:lightning',
        title: 'Cepat & Andal',
        text: 'Resume Anda tersimpan otomatis saat Anda mengetik. Tutup tab dan kembali — draf Anda masih ada.',
      },
      {
        icon: 'ph:download-simple',
        title: 'Unduh Instan',
        text: 'Ekspor PDF yang rapi dan siap cetak begitu Anda selesai. Tanpa menunggu, tanpa verifikasi email.',
      },
      {
        icon: 'ph:lock-key',
        title: 'Aman & Privat',
        text: 'Data Anda tetap di penyimpanan lokal browser Anda. Tidak ada yang diunggah, akun tidak pernah diperlukan.',
      },
    ],
  },
  faq: {
    title: 'Pertanyaan yang sering diajukan',
    subtitle: 'Jawaban cepat untuk pertanyaan umum.',
    items: [
      {
        q: 'Apakah saya perlu keahlian desain untuk menggunakan pembuat resume?',
        a: 'Tidak. Pembuat ini menggunakan template yang rapi dan dirancang secara profesional, sehingga pemformatan sudah diurus untuk Anda. Cukup isi detail Anda dan pembuat akan mengurus tata letak, spasi, dan tipografi.',
      },
      {
        q: 'Bisakah saya menambahkan foto profil ke resume saya?',
        a: 'Ya. Anda dapat mengunggah foto di bagian detail pribadi dan mengaktifkan atau menonaktifkannya untuk template apa pun. Foto bersifat opsional — banyak perekrut lebih menyukai resume tanpa foto.',
      },
      {
        q: 'Apakah saya harus mendaftar untuk membuat atau mengunduh resume saya?',
        a: 'Tidak perlu mendaftar. Anda dapat membuat resume dan mengunduh PDF sepenuhnya gratis, tanpa membuat akun atau membagikan email Anda.',
      },
      {
        q: 'Apakah ini benar-benar gratis?',
        a: 'Ya — setiap fitur gratis, termasuk semua template dan unduhan PDF. Tidak ada tingkatan premium dan tidak ada biaya tersembunyi.',
      },
      {
        q: 'Bisakah saya mengedit resume saya setelah mengunduhnya?',
        a: 'Tentu saja. Draf Anda tersimpan otomatis di browser Anda, sehingga Anda dapat membuka kembali pembuat kapan saja, membuat perubahan, dan mengunduh PDF yang diperbarui.',
      },
      {
        q: 'Bisakah saya menambahkan bagian kustom saya sendiri?',
        a: 'Ya. Anda dapat menambahkan bagian kustom dengan teks biasa atau poin-poin — berguna untuk sertifikasi, proyek, kerja sukarela, atau hal lain yang ingin Anda tunjukkan kepada perekrut.',
      },
    ],
  },
  ctaBand: {
    title: 'Siap membuat resume Anda?',
    text: 'Bergabunglah dengan ribuan pencari kerja yang membuat resume profesional dalam hitungan menit — gratis, privat, tanpa daftar.',
    button: 'Buat Resume Saya',
  },
  footer: {
    tagline: `${BRAND.name} adalah pembuat resume online gratis. Tanpa daftar — data Anda tetap di browser Anda.`,
    usefulTitle: 'Tautan Berguna',
    importantTitle: 'Penting',
    followTitle: 'Ikuti Kami',
    rights: 'Hak cipta dilindungi.',
  },
  about: {
    title: `Tentang ${BRAND.name}`,
    p1: `${BRAND.name} adalah pembuat resume online gratis yang dibuat untuk satu tugas sederhana: membantu Anda membuat resume profesional dengan cepat, tanpa keahlian desain dan tanpa membayar.`,
    p2: 'Perekrut biasanya hanya menghabiskan beberapa detik untuk memindai resume, sehingga struktur dan keterbacaan lebih penting daripada dekorasi. Setiap template di sini dibangun dengan ide itu — judul yang jelas, bagian yang rapi, dan tata letak yang cocok untuk pembaca manusia maupun sistem pelacakan pelamar.',
    p3: 'Tidak ada pendaftaran dan tidak ada yang diunggah. Data resume Anda tersimpan di browser Anda sendiri, sehingga apa yang Anda tulis tetap milik Anda.',
  },
  privacy: {
    title: 'Kebijakan Privasi',
    intro: 'Kebijakan ini menjelaskan apa yang terjadi pada data Anda saat Anda menggunakan situs ini. Versi singkatnya: hampir tidak ada — semuanya tetap di perangkat Anda.',
    items: [
      {
        h: 'Data resume Anda tetap di browser Anda',
        p: 'Detail yang Anda ketik di pembuat — nama, info kontak, pengalaman, dan pendidikan — hanya disimpan di penyimpanan lokal browser Anda di perangkat Anda sendiri. Kami tidak mengirim data ini ke server mana pun.',
      },
      {
        h: 'Tidak ada yang diunggah',
        p: 'File yang Anda lampirkan, seperti foto profil, diproses secara lokal di browser Anda dan tidak pernah diunggah ke mana pun. Tidak ada akun backend atau database yang menyimpan informasi Anda.',
      },
      {
        h: 'Tanpa akun, tanpa pelacakan',
        p: 'Anda tidak memerlukan akun untuk menggunakan pembuat, jadi kami tidak mengumpulkan nama, email, atau kata sandi. Kami tidak menggunakan iklan atau analitik pihak ketiga yang membuat profil Anda.',
      },
      {
        h: 'Kontak',
        p: 'Jika Anda memiliki pertanyaan tentang kebijakan ini atau tentang data Anda, Anda dapat menghubungi kami melalui informasi kontak di halaman Tentang.',
      },
    ],
  },
  notFound: {
    title: 'Halaman tidak ditemukan',
    text: 'Halaman yang Anda cari tidak ada atau telah dipindahkan.',
    button: 'Kembali ke beranda',
  },
  builder: {
    title: 'Buat Resume Anda',
    metaDesc: 'Pembuat resume gratis dengan pratinjau langsung. Isi detail Anda, pilih template, unduh PDF — tanpa daftar.',
    templateTitle: 'Pilih template',
    templateSubtitle: 'Pilih desain — Anda bisa menggantinya kapan saja.',
    templates: {
      minimal: { name: 'Minimal', desc: 'Rapi dan sederhana, keterbacaan maksimal.' },
      professional: { name: 'Profesional', desc: 'Tata letak klasik untuk peran korporat.' },
      modern: { name: 'Modern', desc: 'Desain segar dengan header yang berani.' },
      classic: { name: 'Klasik', desc: 'Gaya serif abadi untuk industri formal.' },
    },
    customizeTitle: 'Kustomisasi',
    accentLabel: 'Warna aksen',
    fontLabel: 'Font',
    fontOptions: { poppins: 'Poppins', inter: 'Inter', serif: 'Serif' },
    showPhotoLabel: 'Tampilkan foto',
    sections: {
      personal: 'Detail Pribadi',
      summary: 'Ringkasan Profesional',
      experience: 'Pengalaman Kerja',
      education: 'Pendidikan',
      skills: 'Keterampilan',
      languages: 'Bahasa',
      custom: 'Bagian Kustom',
    },
    personal: {
      fullName: 'Nama lengkap',
      jobTitle: 'Jabatan',
      email: 'Email',
      phone: 'Telepon',
      location: 'Lokasi',
      photo: 'Foto',
      photoUpload: 'Unggah foto',
      photoChange: 'Ganti foto',
      photoRemove: 'Hapus',
    },
    summary: {
      label: 'Ringkasan',
      placeholder: 'Paragraf singkat tentang pengalaman, kekuatan, dan tujuan karier Anda…',
    },
    experience: {
      add: 'Tambah pengalaman',
      jobTitle: 'Jabatan',
      company: 'Perusahaan',
      startDate: 'Tanggal mulai',
      endDate: 'Tanggal selesai',
      present: 'Saat ini',
      description: 'Deskripsi',
      descriptionHint: 'Satu pencapaian per baris',
      remove: 'Hapus',
      moveUp: 'Pindah ke atas',
      moveDown: 'Pindah ke bawah',
    },
    education: {
      add: 'Tambah pendidikan',
      degree: 'Gelar / Kualifikasi',
      school: 'Sekolah / Universitas',
      year: 'Tahun',
      remove: 'Hapus',
      moveUp: 'Pindah ke atas',
      moveDown: 'Pindah ke bawah',
    },
    skills: {
      label: 'Keterampilan',
      hint: 'Pisahkan keterampilan dengan koma',
      placeholder: 'mis. Komunikasi, JavaScript, Manajemen Proyek',
    },
    languages: {
      label: 'Bahasa',
      hint: 'Pisahkan bahasa dengan koma',
      placeholder: 'mis. Inggris, Hindi, Spanyol',
    },
    custom: {
      addSection: 'Tambah bagian kustom',
      sectionTitle: 'Judul bagian',
      typeLabel: 'Tipe',
      typeText: 'Teks',
      typeBullets: 'Poin-poin',
      contentLabel: 'Konten',
      remove: 'Hapus bagian',
    },
    actions: {
      downloadPdf: 'Unduh PDF',
      fillSample: 'Isi data contoh',
      clear: 'Hapus semua',
      saved: 'Tersimpan',
      confirmClear: 'Apakah Anda yakin ingin menghapus semua data?',
    },
    tabs: {
      edit: 'Edit',
      preview: 'Pratinjau',
    },
    previewTitle: 'Pratinjau langsung',
  },
};

export default id;
