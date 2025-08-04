export const pondokData = {
  name: "Pondok Pesantren Tahfidzul Qur'an Asy-Syaikhoni",
  shortName: 'PPTQ Asy-Syaikhoni',
  tagline: "Mencetak Generasi Qur'ani yang Berakhlak Mulia",
  description:
    "Pondok pesantren yang fokus pada tahfidz Al-Qur'an dengan lingkungan yang nyaman, bersih, dan asri untuk menimba ilmu agama Islam.",

  contact: {
    phone: '0815-1578-8862',
    email: 'yayasan.asyaikhoni@gmail.com',
    address: 'Jabon, Tj. Kalang, Kec. Ngronggot, Kabupaten Nganjuk, Jawa Timur 64395',
    maps: 'https://maps.app.goo.gl/TTVxPAcfveFxFzJy8',
  },

  socialMedia: {
    instagram: 'https://www.instagram.com/pptq_asyaikhoni/',
    youtube: 'https://www.youtube.com/@pptq_asyaikhoni',
    linktree: 'https://lynk.id/pptq-asyaikhoni',
    whatsapp: 'https://wa.me/6281515788862',
  },

  programs: [
    {
      id: 1,
      title: "Tahfidz Al-Qur'an",
      description: "Program utama menghafal Al-Qur'an dengan metode yang telah terbukti efektif",
      icon: 'book-open',
      features: ['Bimbingan intensif', 'Metode modern', 'Target jelas'],
    },
    {
      id: 2,
      title: 'Pendidikan Agama',
      description: 'Pembelajaran ilmu-ilmu agama Islam secara komprehensif',
      icon: 'academic-cap',
      features: ['Fiqh', 'Aqidah', 'Akhlaq', 'Hadits'],
    },
    {
      id: 3,
      title: 'Pembinaan Akhlaq',
      description: 'Pembentukan karakter islami yang kuat dan berakhlak mulia',
      icon: 'heart',
      features: ['Adab sehari-hari', 'Sopan santun', 'Kedisiplinan'],
    },
    {
      id: 4,
      title: 'Kegiatan Ekstrakurikuler',
      description: 'Berbagai kegiatan untuk mengembangkan bakat dan minat santri',
      icon: 'users',
      features: ['Olahraga', 'Seni', 'Organisasi'],
    },
  ],

  facilities: [
    {
      id: 1,
      name: 'Asrama Nyaman',
      description: 'Tempat tinggal yang bersih dan nyaman untuk santri',
      icon: 'home',
    },
    {
      id: 2,
      name: 'Musholla',
      description: 'Tempat ibadah yang tenang untuk shalat berjamaah',
      icon: 'mosque',
    },
    {
      id: 3,
      name: 'Ruang Belajar',
      description: 'Ruang kelas yang kondusif untuk kegiatan belajar mengajar',
      icon: 'library',
    },
    {
      id: 4,
      name: 'Perpustakaan',
      description: 'Koleksi buku-buku agama dan pengetahuan umum',
      icon: 'book',
    },
    {
      id: 5,
      name: 'Area Olahraga',
      description: 'Lapangan untuk kegiatan olahraga dan rekreasi',
      icon: 'sports',
    },
    {
      id: 6,
      name: 'Kantin',
      description: 'Menyediakan makanan halal dan bergizi untuk santri',
      icon: 'restaurant',
    },
  ],

  testimonials: [
    {
      id: 1,
      name: 'Ahmad Ibnu Aqil',
      role: 'Pengunjung',
      content: 'Pondok Hafalan berkwalitas, bersih, asri, lokasi cukup luas',
      rating: 5,
    },
    {
      id: 2,
      name: 'M. Abu Amar Al Badawi',
      role: 'Pengunjung',
      content: "Tempat menimba ilmu dan menghafalkan Al-Qur'an dengan tempat yang nyaman",
      rating: 5,
    },
    {
      id: 3,
      name: 'Alfi Fauzi',
      role: 'Pengunjung',
      content: 'Sangat menyenangkan, seru, ramai, santai, mantap pokoknya👍',
      rating: 5,
    },
  ],

  stats: [
    {
      id: 1,
      number: '100+',
      label: 'Santri Aktif',
      icon: 'users',
    },
    {
      id: 2,
      number: '50+',
      label: 'Hafidz Alumni',
      icon: 'graduation-cap',
    },
    {
      id: 3,
      number: '15+',
      label: 'Tahun Berdiri',
      icon: 'calendar',
    },
    {
      id: 4,
      number: '24/7',
      label: 'Bimbingan',
      icon: 'clock',
    },
  ],
}

export const navigationMenu = [
  { name: 'Beranda', href: '#home', id: 'home' },
  { name: 'Tentang', href: '#about', id: 'about' },
  { name: 'Program', href: '#programs', id: 'programs' },
  { name: 'Fasilitas', href: '#facilities', id: 'facilities' },
  { name: 'Testimoni', href: '#testimonials', id: 'testimonials' },
  { name: 'Kontak', href: '#contact', id: 'contact' },
]
