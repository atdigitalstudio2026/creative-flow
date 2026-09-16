import {
  UserProfile,
  Department,
  Project,
  Campaign,
  Task,
  AuditLog,
  NotificationItem,
  TaskTemplate
} from '../types';

export const INITIAL_DEPARTMENTS: Department[] = [
  { id: 'dept-1', name: 'Creative & Graphic Design', code: 'CR-DES' },
  { id: 'dept-2', name: 'Content Creation & Video', code: 'CR-VID' },
  { id: 'dept-3', name: 'Brand Marketing & Strategy', code: 'CR-MKT' },
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-admin',
    full_name: 'Hendra Wijaya',
    email: 'hendra.admin@creativetaskflow.internal',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'SUPER_ADMIN',
    department_id: 'dept-1',
    department_name: 'Creative & Graphic Design',
    position: 'Head of Creative Operations & Admin',
    is_active: true,
    created_at: '2026-01-01T08:00:00Z',
  },
  {
    id: 'user-manager',
    full_name: 'Maya Safitri',
    email: 'maya.manager@creativetaskflow.internal',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'MANAGER',
    department_id: 'dept-1',
    department_name: 'Creative & Graphic Design',
    position: 'Creative Lead & Traffic Manager',
    is_active: true,
    created_at: '2026-01-05T08:00:00Z',
  },
  {
    id: 'user-designer-1',
    full_name: 'Reza Pratama',
    email: 'reza.designer@creativetaskflow.internal',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'DESIGNER',
    department_id: 'dept-1',
    department_name: 'Creative & Graphic Design',
    position: 'Senior Graphic Designer',
    is_active: true,
    created_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'user-designer-2',
    full_name: 'Sarah Lestari',
    email: 'sarah.designer@creativetaskflow.internal',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'DESIGNER',
    department_id: 'dept-1',
    department_name: 'Creative & Graphic Design',
    position: 'UI & Visual Designer',
    is_active: true,
    created_at: '2026-02-01T08:00:00Z',
  },
  {
    id: 'user-content-1',
    full_name: 'Dimas Anggara',
    email: 'dimas.content@creativetaskflow.internal',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'CONTENT_CREATOR',
    department_id: 'dept-2',
    department_name: 'Content Creation & Video',
    position: 'Motion & Social Content Creator',
    is_active: true,
    created_at: '2026-02-15T08:00:00Z',
  },
  {
    id: 'user-requester-1',
    full_name: 'Anita Kusumawardani',
    email: 'anita.requester@creativetaskflow.internal',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    role: 'REQUESTER',
    department_id: 'dept-3',
    department_name: 'Brand Marketing & Strategy',
    position: 'Brand Marketing Manager',
    is_active: true,
    created_at: '2026-03-01T08:00:00Z',
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'prj-1',
    name: 'New Product Launch: Sambal Sambu',
    code: 'PRJ-SS26',
    description: 'Peluncuran lini produk sambal kemasan botol premium aneka varian',
    client_name: 'PT Sambu Pangan Nusantara',
    status: 'ACTIVE',
    department_id: 'dept-3'
  },
  {
    id: 'prj-2',
    name: 'Flash Sale Super 10.10 Campaign',
    code: 'PRJ-FS10',
    description: 'Aset visual promosi marketplace Shopee, Tokopedia, TikTok Shop',
    client_name: 'E-Commerce Division',
    status: 'ACTIVE',
    department_id: 'dept-3'
  },
  {
    id: 'prj-3',
    name: 'Always-On Social Media 2026',
    code: 'PRJ-AON26',
    description: 'Konten feed, story, reels rutin setiap minggu untuk Instagram & TikTok',
    client_name: 'Internal Brand',
    status: 'ACTIVE',
    department_id: 'dept-2'
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp-1',
    project_id: 'prj-1',
    name: 'Teaser & Launching Sambal Sambu',
    code: 'CMP-SS-LNCH',
    start_date: '2026-09-01',
    end_date: '2026-09-30'
  },
  {
    id: 'cmp-2',
    project_id: 'prj-2',
    name: 'Diskon Kilat 10.10 All Out',
    code: 'CMP-1010-MEGA',
    start_date: '2026-09-20',
    end_date: '2026-10-10'
  }
];

export const INITIAL_TEMPLATES: TaskTemplate[] = [
  {
    id: 'tmpl-1',
    name: 'Instagram Feed Post & Carousel',
    task_type: 'Social Media Post',
    description: 'Template desain feed Instagram ukuran 1080x1080 atau 1080x1350 px',
    default_priority: 'NORMAL',
    default_sla_hours: 24,
    default_brief: {
      objective: 'Meningkatkan engagement audiens dan edukasi value produk',
      target_audience: 'Generasi muda, 20-35 tahun, aktif di media sosial',
      keyMessage: 'Kualitas rasa otentik dengan kepraktisan tinggi',
      designDirection: 'Clean, foto produk tajam, typography playful namun terbaca jelas',
      mandatoryElements: 'Logo di pojok kanan atas, CTA "Simpan & Share"',
      doList: 'Gunakan tone warna hangat; Sediakan safe area border 40px',
      dontList: 'Jangan menumpuk teks panjang; Hindari saturasi warna berlebihan',
      reference_links: [{ title: 'Moodboard Instagram', url: 'https://pinterest.com' }]
    },
    default_checklist: [
      'Logo brand resolusi tinggi',
      'Headline tipografi proporsional',
      'Foto produk utama ter-grading',
      'CTA (Call To Action)',
      'Export JPG/PNG 1080x1350px'
    ]
  },
  {
    id: 'tmpl-2',
    name: 'Marketplace Banner Mega Sale',
    task_type: 'Marketplace Banner',
    description: 'Banner Shopee, Tokopedia & TikTok Shop untuk promo flash sale',
    default_priority: 'HIGH',
    default_sla_hours: 18,
    default_brief: {
      objective: 'Mendorong klik dan konversi transaksi saat periode flash sale',
      target_audience: 'Pencari promo hemat & loyal buyer online',
      keyMessage: 'Diskon hingga 50% + Gratis Ongkir Terbatas',
      designDirection: 'High urgency, warna vibran (merah/kuning), harga sangat jelas',
      mandatoryElements: 'Badge Promo, Label Diskon, Logo Official Store, CTA "Klaim Voucher"',
      doList: 'Angka diskon menjadi focal point utama',
      dontList: 'Jangan buat teks harga terlalu tipis',
      reference_links: [{ title: 'Shopee Official Banner Standards', url: 'https://shopee.co.id' }]
    },
    default_checklist: [
      'Banner Desktop 1200x500px',
      'Banner Mobile 720x360px',
      'Voucher Code highlight',
      'Informasi periode tanggal promo'
    ]
  },
  {
    id: 'tmpl-3',
    name: 'Video Reels & TikTok Short Content',
    task_type: 'Video Reels',
    description: 'Video vertikal 9:16 durasi 15-45 detik dengan transisi dinamis',
    default_priority: 'NORMAL',
    default_sla_hours: 48,
    default_brief: {
      objective: 'Menciptakan viralitas dan interaksi organic melalui video pendek',
      target_audience: 'Pengguna TikTok & Instagram Reels',
      keyMessage: 'Sensasi pedas nagih yang bikin nambah nasi',
      designDirection: 'Dynamic cut, sound trending, color grading appetizing',
      mandatoryElements: 'Subtitle/caption dinamis, logo di akhir video, audio jingle',
      doList: 'Hook 3 detik pertama harus langsung memikat selera',
      dontList: 'Hindari opening logo statis yang membosankan',
      reference_links: [{ title: 'Contoh Reels Food Trending', url: 'https://instagram.com' }]
    },
    default_checklist: [
      'Storyline / Scene Script',
      'B-roll footage recording',
      'Audio & Sound Effects sync',
      'Dynamic Subtitles On-Screen',
      'Color Grading & Render MP4 1080x1920'
    ]
  },
  {
    id: 'tmpl-4',
    name: 'Packaging & Bottle Label Print',
    task_type: 'Packaging Desain',
    description: 'Artwork kemasan fisik botol / box cetak CMYK siap produksi',
    default_priority: 'URGENT',
    default_sla_hours: 72,
    default_brief: {
      objective: 'Desain label botol premium standar industri dengan informasi BPOM lengkap',
      target_audience: 'Konsumen retail supermarket dan toko oleh-oleh modern',
      keyMessage: 'Tradisional resep nusantara dengan standar higienis modern',
      designDirection: 'Elegan, tekstur doff/gold foil accent, ilustrasi cabai klasik',
      mandatoryElements: 'Logo Brand, Netto, Nomor BPOM, Barcode, Tabel Nutrisi, Komposisi',
      doList: 'Wajib gunakan format warna CMYK dan tambahkan Bleed 3mm',
      dontList: 'DILARANG menggunakan format RGB untuk materi cetak',
      reference_links: [{ title: 'Dieline Botol 250ml Standar', url: 'https://packagingspec.internal' }]
    },
    default_checklist: [
      'Verifikasi Dieline ukuran botol',
      'Konversi font ke Outline/Curves',
      'Cek resolusi gambar minimal 300 DPI',
      'Verifikasi barcode dapat discan',
      'Export PDF Print-Ready X-1a'
    ]
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    task_id: 'CR-2026-00001',
    title: 'Poster Promo Sambal Sambu Pedas Nampol (Marketplace & IG Feed)',
    description: 'Desain materi promosi utama untuk campaign peluncuran varian Sambal Terasi & Sambal Bawang.',
    task_type: 'Poster & Social Media',
    project_id: 'prj-1',
    project_name: 'New Product Launch: Sambal Sambu',
    campaign_id: 'cmp-1',
    campaign_name: 'Teaser & Launching Sambal Sambu',
    department_id: 'dept-1',
    department_name: 'Creative & Graphic Design',
    requester_id: 'user-requester-1',
    requester_name: 'Anita Kusumawardani',
    manager_id: 'user-manager',
    manager_name: 'Maya Safitri',
    current_assignee_id: 'user-designer-2',
    current_assignee_name: 'Sarah Lestari',
    current_assignee_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    original_assignee_id: 'user-designer-1',
    original_assignee_name: 'Reza Pratama',
    priority: 'HIGH',
    deadline: '2026-09-15T17:00:00Z',
    estimated_effort: '12 Jam',
    progress_percentage: 100,
    status: 'APPROVED',
    is_archived: false,
    created_at: '2026-09-10T09:00:00Z',
    updated_at: '2026-09-13T16:00:00Z',
    completed_at: '2026-09-13T15:45:00Z',

    brief: {
      id: 'brief-1',
      task_id: 'task-1',
      objective: 'Menciptakan daya tarik visual rasa pedas otentik untuk memicu checkout di marketplace',
      target_audience: 'Pencinta sambal nusantara, usia 22-45 tahun, pembeli online',
      keyMessage: 'Sensasi Pedasnya Bikin Nagih! Sekali Coba Pasti Mau Nambah',
      designDirection: 'Dominasi warna merah cabai dan emas hangat. Fotografi produk dibuat juicy dan fresh.',
      mandatoryElements: 'Logo Sambal Sambu, Badge Halal, Badge BPOM, Kemasan Botol 2 Varian, CTA "Beli di Shopee/Tokopedia"',
      doList: 'Tampilkan cipratan minyak sambal yang lezat; Font display tegas dan menggugah selera.',
      dontList: 'Jangan menggunakan background gelap kusam; Jangan crop ujung botol kemasan.',
      reference_links: [
        { title: 'Moodboard Sambal Pedas', url: 'https://drive.google.com/folder/moodboard-sambu' },
        { title: 'Foto Raw Produk 4K', url: 'https://storage.creativetaskflow.internal/assets/raw-sambu.zip' }
      ],
      additional_notes: 'File master PSD/AI harus tertata rapi layer-nya agar mudah dibuat adaptasi ukuran lain.'
    },

    checklists: [
      { id: 'chk-1', task_id: 'task-1', title: 'Asset Foto Botol 2 Varian Resolusi Tinggi', completed: true, completed_by: 'user-designer-1', completed_at: '2026-09-10T11:00:00Z', sort_order: 1 },
      { id: 'chk-2', task_id: 'task-1', title: 'Logo Brand & Badge Halal / BPOM', completed: true, completed_by: 'user-designer-1', completed_at: '2026-09-10T11:15:00Z', sort_order: 2 },
      { id: 'chk-3', task_id: 'task-1', title: 'Headline Tipografi Sambal Sambu Pedas Nampol', completed: true, completed_by: 'user-designer-2', completed_at: '2026-09-12T14:00:00Z', sort_order: 3 },
      { id: 'chk-4', task_id: 'task-1', title: 'Ukuran Square 1080x1080 & Portrait 1080x1350', completed: true, completed_by: 'user-designer-2', completed_at: '2026-09-13T10:00:00Z', sort_order: 4 },
      { id: 'chk-5', task_id: 'task-1', title: 'Export File JPG, PNG Transparan & PSD Master', completed: true, completed_by: 'user-designer-2', completed_at: '2026-09-13T14:30:00Z', sort_order: 5 }
    ],

    versions: [
      {
        id: 'ver-1',
        task_id: 'task-1',
        version_number: 'V1',
        uploaded_by: 'user-designer-1',
        uploaded_by_name: 'Reza Pratama',
        file_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&auto=format&fit=crop&q=80',
        file_name: 'CR-00001_SambalSambu_Poster_V1.jpg',
        file_type: 'image/jpeg',
        file_size: 4520000,
        description: 'Draft pertama penataan botol dan headline merah.',
        is_approved: false,
        created_at: '2026-09-11T14:30:00Z'
      },
      {
        id: 'ver-2',
        task_id: 'task-1',
        version_number: 'V2',
        uploaded_by: 'user-designer-1',
        uploaded_by_name: 'Reza Pratama',
        file_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&auto=format&fit=crop&q=80',
        file_name: 'CR-00001_SambalSambu_Poster_V2.jpg',
        file_type: 'image/jpeg',
        file_size: 4980000,
        description: 'Penambahan efek cabai dan splash minyak.',
        is_approved: false,
        created_at: '2026-09-12T09:15:00Z'
      },
      {
        id: 'ver-3',
        task_id: 'task-1',
        version_number: 'V3',
        uploaded_by: 'user-designer-2',
        uploaded_by_name: 'Sarah Lestari (Melanjutkan pasca Handover)',
        file_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1200&auto=format&fit=crop&q=80',
        file_name: 'CR-00001_SambalSambu_Poster_V3.jpg',
        file_type: 'image/jpeg',
        file_size: 5120000,
        description: 'Perbaikan tipografi lebih bold dan penyesuaian kontras latar.',
        is_approved: false,
        created_at: '2026-09-13T11:20:00Z'
      },
      {
        id: 'ver-4',
        task_id: 'task-1',
        version_number: 'V4 (FINAL)',
        uploaded_by: 'user-designer-2',
        uploaded_by_name: 'Sarah Lestari',
        file_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200&auto=format&fit=crop&q=80',
        file_name: 'CR-00001_SambalSambu_Poster_FINAL.jpg',
        file_type: 'image/jpeg',
        file_size: 6420000,
        description: 'Final artwork resolusi tinggi siap distribusi ke media promo.',
        is_approved: true,
        created_at: '2026-09-13T14:45:00Z'
      }
    ],

    revisions: [
      {
        id: 'rev-1',
        task_id: 'task-1',
        revision_number: 1,
        requested_by: 'user-manager',
        requested_by_name: 'Maya Safitri (Manager)',
        requested_at: '2026-09-12T10:30:00Z',
        feedback: '1. Logo Sambal Sambu di V2 agak terlalu kecil, perbesar 15%.\n2. Headline "Pedas Nampol" perlu kontras lebih tajam agar terbaca di smartphone.\n3. Background kiri jangan terlalu gelap, buat lebih warm.',
        status: 'RESOLVED',
        resolved_at: '2026-09-13T11:25:00Z',
        resolved_by: 'user-designer-2',
        resolved_by_name: 'Sarah Lestari'
      }
    ],

    approval: {
      id: 'app-1',
      task_id: 'task-1',
      approved_by: 'user-manager',
      approved_by_name: 'Maya Safitri (Manager)',
      approved_version: 'V4 (FINAL)',
      approval_note: 'Artwork sudah sempurna. Komposisi seimbang, warna fresh menggugah selera, dan seluruh elemen wajib terpenuhi. Approved untuk distribusi launch!',
      approved_at: '2026-09-13T15:45:00Z'
    },

    handovers: [
      {
        id: 'hnd-1',
        task_id: 'task-1',
        previous_assignee_id: 'user-designer-1',
        previous_assignee_name: 'Reza Pratama',
        new_assignee_id: 'user-designer-2',
        new_assignee_name: 'Sarah Lestari',
        reason: 'Reza dialihkan ke proyek darurat Flash Sale 10.10 yang deadline-nya besok pagi.',
        progress_summary: 'Progress sudah 75%. Base visual sudah ada di file V2, tinggal mengeksekusi feedback revisi #1 (perbesar logo dan rapikan tipografi headline).',
        handover_notes: 'Gunakan file master "CR-00001_SambalSambu_V2.psd" yang ada di cloud storage folder task ini.',
        current_version: 'V2',
        created_by: 'user-manager',
        created_by_name: 'Maya Safitri',
        created_at: '2026-09-12T13:30:00Z'
      }
    ],

    assignments: [
      {
        id: 'asg-1',
        task_id: 'task-1',
        assigned_to: 'user-designer-1',
        assigned_to_name: 'Reza Pratama',
        assigned_by: 'user-manager',
        assigned_by_name: 'Maya Safitri',
        reason: 'Initial assignment untuk senior graphic designer',
        assigned_at: '2026-09-10T09:15:00Z',
        ended_at: '2026-09-12T13:30:00Z'
      },
      {
        id: 'asg-2',
        task_id: 'task-1',
        assigned_from: 'user-designer-1',
        assigned_from_name: 'Reza Pratama',
        assigned_to: 'user-designer-2',
        assigned_to_name: 'Sarah Lestari',
        assigned_by: 'user-manager',
        assigned_by_name: 'Maya Safitri',
        reason: 'Handover akibat pergeseran prioritas tim kampanye',
        assigned_at: '2026-09-12T13:30:00Z'
      }
    ],

    comments: [
      {
        id: 'com-1',
        task_id: 'task-1',
        user_id: 'user-manager',
        user_name: 'Maya Safitri',
        user_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        comment: '@Reza tolong pastikan logo Halal dan BPOM diletakkan berdampingan di pojok kanan bawah ya.',
        mentions: ['reza.designer@creativetaskflow.internal'],
        created_at: '2026-09-10T09:30:00Z'
      },
      {
        id: 'com-2',
        task_id: 'task-1',
        user_id: 'user-designer-1',
        user_name: 'Reza Pratama',
        user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        comment: 'Siap Bu Maya, sedang saya tata di V2.',
        mentions: [],
        created_at: '2026-09-10T10:05:00Z'
      },
      {
        id: 'com-3',
        task_id: 'task-1',
        user_id: 'user-designer-2',
        user_name: 'Sarah Lestari',
        user_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        comment: 'Halo Bu Maya, task handover sudah saya terima. Saya sudah perbaiki revisi di V3 dan sekarang mengunggah versi V4 FINAL.',
        mentions: ['maya.manager@creativetaskflow.internal'],
        created_at: '2026-09-13T14:48:00Z'
      }
    ],

    activity_logs: [
      { id: 'act-1', task_id: 'task-1', actor_id: 'user-requester-1', actor_name: 'Anita Kusumawardani', action: 'CREATE', description: 'Membuat permintaan task baru CR-2026-00001', created_at: '2026-09-10T09:00:00Z' },
      { id: 'act-2', task_id: 'task-1', actor_id: 'user-manager', actor_name: 'Maya Safitri', action: 'ASSIGN', description: 'Menugaskan task ke Reza Pratama dengan deadline 15 Sept', created_at: '2026-09-10T09:15:00Z' },
      { id: 'act-3', task_id: 'task-1', actor_id: 'user-designer-1', actor_name: 'Reza Pratama', action: 'STATUS_CHANGE', description: 'Memulai pengerjaan (Status: IN_PROGRESS)', created_at: '2026-09-10T09:40:00Z' },
      { id: 'act-4', task_id: 'task-1', actor_id: 'user-designer-1', actor_name: 'Reza Pratama', action: 'FILE_UPLOAD', description: 'Mengunggah file versi V1', created_at: '2026-09-11T14:30:00Z' },
      { id: 'act-5', task_id: 'task-1', actor_id: 'user-designer-1', actor_name: 'Reza Pratama', action: 'FILE_UPLOAD', description: 'Mengunggah file versi V2', created_at: '2026-09-12T09:15:00Z' },
      { id: 'act-6', task_id: 'task-1', actor_id: 'user-manager', actor_name: 'Maya Safitri', action: 'REVISION_REQUEST', description: 'Meminta revisi putaran #1 (Logo & Headline)', created_at: '2026-09-12T10:30:00Z' },
      { id: 'act-7', task_id: 'task-1', actor_id: 'user-manager', actor_name: 'Maya Safitri', action: 'HANDOVER', description: 'Memindahkan task dari Reza Pratama ke Sarah Lestari dengan catatan handover lengkap', created_at: '2026-09-12T13:30:00Z' },
      { id: 'act-8', task_id: 'task-1', actor_id: 'user-designer-2', actor_name: 'Sarah Lestari', action: 'FILE_UPLOAD', description: 'Mengunggah file versi V3 (Perbaikan Revisi #1)', created_at: '2026-09-13T11:20:00Z' },
      { id: 'act-9', task_id: 'task-1', actor_id: 'user-designer-2', actor_name: 'Sarah Lestari', action: 'RESUBMISSION', description: 'Menandai revisi selesai & mengajukan review V4 FINAL', created_at: '2026-09-13T14:45:00Z' },
      { id: 'act-10', task_id: 'task-1', actor_id: 'user-manager', actor_name: 'Maya Safitri', action: 'APPROVAL', description: 'Memberikan Approval Final pada versi V4 (FINAL)', created_at: '2026-09-13T15:45:00Z' }
    ],

    dependencies: []
  },

  {
    id: 'task-2',
    task_id: 'CR-2026-00002',
    title: 'Video Reels TikTok: Behind the Scenes Masak Sambal Sambu',
    description: 'Video vertikal 9:16 durasi 30 detik menampilkan proses masak sambal tradisional yang higienis dan menggugah selera.',
    task_type: 'Video Reels',
    project_id: 'prj-1',
    project_name: 'New Product Launch: Sambal Sambu',
    campaign_id: 'cmp-1',
    campaign_name: 'Teaser & Launching Sambal Sambu',
    department_id: 'dept-2',
    department_name: 'Content Creation & Video',
    requester_id: 'user-requester-1',
    requester_name: 'Anita Kusumawardani',
    manager_id: 'user-manager',
    manager_name: 'Maya Safitri',
    current_assignee_id: 'user-content-1',
    current_assignee_name: 'Dimas Anggara',
    current_assignee_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    original_assignee_id: 'user-content-1',
    original_assignee_name: 'Dimas Anggara',
    priority: 'HIGH',
    deadline: '2026-09-14T17:00:00Z',
    estimated_effort: '8 Jam',
    progress_percentage: 65,
    status: 'IN_PROGRESS',
    is_archived: false,
    created_at: '2026-09-11T10:00:00Z',
    updated_at: '2026-09-13T17:00:00Z',

    brief: {
      id: 'brief-2',
      task_id: 'task-2',
      objective: 'Memperlihatkan keaslian bahan baku cabai segar dan higienitas dapur masak',
      target_audience: 'Penikmat konten kuliner di TikTok & Instagram Reels',
      keyMessage: 'Dibuat dari 100% cabai segar pilihan tanpa pengawet berbahaya',
      designDirection: 'ASMR suara ulekan dan minyak panas, color grading saturated warm, transisi cepat',
      mandatoryElements: 'Opening hook 3 detik, logo Sambal Sambu di pojok kiri atas, closing packshot botol',
      doList: 'Gunakan audio trending bertema memasak santai yang bersemangat',
      dontList: 'Jangan menggunakan audio bersuara bising atau noise angin',
      reference_links: [{ title: 'Contoh Reels Viral Kuliner', url: 'https://tiktok.com/@sambal' }]
    },

    checklists: [
      { id: 'chk-21', task_id: 'task-2', title: 'Editing kasar (Rough Cut) urutan adegan', completed: true, completed_by: 'user-content-1', completed_at: '2026-09-12T16:00:00Z', sort_order: 1 },
      { id: 'chk-22', task_id: 'task-2', title: 'Color grading warm appetizing', completed: true, completed_by: 'user-content-1', completed_at: '2026-09-13T11:00:00Z', sort_order: 2 },
      { id: 'chk-23', task_id: 'task-2', title: 'Audio mixing sound effect ASMR', completed: false, sort_order: 3 },
      { id: 'chk-24', task_id: 'task-2', title: 'Animasi subtitle dan sticker CTA', completed: false, sort_order: 4 }
    ],

    versions: [
      {
        id: 'ver-21',
        task_id: 'task-2',
        version_number: 'V1',
        uploaded_by: 'user-content-1',
        uploaded_by_name: 'Dimas Anggara',
        file_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        file_name: 'CR-00002_Reels_BTS_RoughCut_V1.mp4',
        file_type: 'video/mp4',
        file_size: 24500000,
        description: 'Rough cut video 28 detik urutan bahan baku ke hasil masak.',
        is_approved: false,
        created_at: '2026-09-13T15:00:00Z'
      }
    ],

    revisions: [],
    handovers: [],
    assignments: [
      {
        id: 'asg-21',
        task_id: 'task-2',
        assigned_to: 'user-content-1',
        assigned_to_name: 'Dimas Anggara',
        assigned_by: 'user-manager',
        assigned_by_name: 'Maya Safitri',
        reason: 'Spesialis video & motion kreator',
        assigned_at: '2026-09-11T10:15:00Z'
      }
    ],
    comments: [],
    activity_logs: [
      { id: 'act-21', task_id: 'task-2', actor_id: 'user-manager', actor_name: 'Maya Safitri', action: 'ASSIGN', description: 'Menugaskan task ke Dimas Anggara', created_at: '2026-09-11T10:15:00Z' },
      { id: 'act-22', task_id: 'task-2', actor_id: 'user-content-1', actor_name: 'Dimas Anggara', action: 'FILE_UPLOAD', description: 'Mengunggah file V1 draft video', created_at: '2026-09-13T15:00:00Z' }
    ],
    dependencies: [
      {
        id: 'dep-1',
        predecessor_task_id: 'task-1',
        dependent_task_id: 'task-2',
        predecessor_title: 'Poster Promo Sambal Sambu Pedas Nampol (Marketplace & IG Feed)',
        predecessor_status: 'APPROVED'
      }
    ]
  },

  {
    id: 'task-3',
    task_id: 'CR-2026-00003',
    title: 'Banner Marketplace 10.10 Flash Sale 3 Variasi Ukuran',
    description: 'Header Tokopedia 1200x500, Shopee 720x360, dan TikTok Shop banner untuk diskon 10.10.',
    task_type: 'Marketplace Banner',
    project_id: 'prj-2',
    project_name: 'Flash Sale Super 10.10 Campaign',
    campaign_id: 'cmp-2',
    campaign_name: 'Diskon Kilat 10.10 All Out',
    department_id: 'dept-1',
    department_name: 'Creative & Graphic Design',
    requester_id: 'user-requester-1',
    requester_name: 'Anita Kusumawardani',
    manager_id: 'user-manager',
    manager_name: 'Maya Safitri',
    current_assignee_id: 'user-designer-1',
    current_assignee_name: 'Reza Pratama',
    current_assignee_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    original_assignee_id: 'user-designer-1',
    original_assignee_name: 'Reza Pratama',
    priority: 'URGENT',
    deadline: '2026-09-14T12:00:00Z',
    estimated_effort: '6 Jam',
    progress_percentage: 80,
    status: 'REVISION_REQUIRED',
    is_archived: false,
    created_at: '2026-09-12T08:00:00Z',
    updated_at: '2026-09-13T16:30:00Z',

    brief: {
      id: 'brief-3',
      task_id: 'task-3',
      objective: 'Memaksimalkan CTR banner marketplace saat puncak Flash Sale 10.10',
      target_audience: 'Bargain hunter, ibu rumah tangga, penikmat promo e-commerce',
      keyMessage: 'SERBU 10.10: Diskon 50% + Ekstra Voucher Diskon Rp20.000',
      designDirection: 'Eye-catching, typography diskon berukuran raksasa dengan badge countdown',
      mandatoryElements: 'Badge 10.10, Logo Official Store, Diskon 50%, Free Ongkir Extra',
      doList: 'Angka 50% harus menjadi elemen paling menonjol yang terbaca dalam 1 detik',
      dontList: 'Jangan gunakan font tipis yang sulit dibaca di layar HP 5 inci',
      reference_links: []
    },

    checklists: [
      { id: 'chk-31', task_id: 'task-3', title: 'Adaptasi Shopee Mobile 720x360', completed: true, completed_by: 'user-designer-1', completed_at: '2026-09-13T10:00:00Z', sort_order: 1 },
      { id: 'chk-32', task_id: 'task-3', title: 'Adaptasi Tokopedia Desktop 1200x500', completed: true, completed_by: 'user-designer-1', completed_at: '2026-09-13T11:30:00Z', sort_order: 2 },
      { id: 'chk-33', task_id: 'task-3', title: 'Adaptasi TikTok Shop Banner', completed: false, sort_order: 3 }
    ],

    versions: [
      {
        id: 'ver-31',
        task_id: 'task-3',
        version_number: 'V1',
        uploaded_by: 'user-designer-1',
        uploaded_by_name: 'Reza Pratama',
        file_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80',
        file_name: 'Banner_1010_Shopee_V1.jpg',
        file_type: 'image/jpeg',
        file_size: 3200000,
        description: 'Versi pertama banner marketplace Shopee & Tokped.',
        is_approved: false,
        created_at: '2026-09-13T14:00:00Z'
      }
    ],

    revisions: [
      {
        id: 'rev-31',
        task_id: 'task-3',
        revision_number: 1,
        requested_by: 'user-manager',
        requested_by_name: 'Maya Safitri (Manager)',
        requested_at: '2026-09-13T16:15:00Z',
        feedback: '1. Warna kuning di badge 10.10 dibuat lebih cerah menyala (gunakan hex #FFE500).\n2. Tambahkan border tipis pada teks "Gratis Ongkir" agar tidak tenggelam di latar merah.\n3. Siapkan varian ukuran TikTok Shop sekarang juga.',
        status: 'OPEN'
      }
    ],

    handovers: [],
    assignments: [
      {
        id: 'asg-31',
        task_id: 'task-3',
        assigned_to: 'user-designer-1',
        assigned_to_name: 'Reza Pratama',
        assigned_by: 'user-manager',
        assigned_by_name: 'Maya Safitri',
        reason: 'Eksekusi urgent kampanye e-commerce',
        assigned_at: '2026-09-12T08:15:00Z'
      }
    ],
    comments: [
      {
        id: 'com-31',
        task_id: 'task-3',
        user_id: 'user-manager',
        user_name: 'Maya Safitri',
        user_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        comment: '@Reza mohon prioritaskan revisi ini sebelum jam 19:00 malam ini ya, tim marketing butuh upload ke campaign seller center.',
        mentions: ['reza.designer@creativetaskflow.internal'],
        created_at: '2026-09-13T16:20:00Z'
      }
    ],
    activity_logs: [
      { id: 'act-31', task_id: 'task-3', actor_id: 'user-manager', actor_name: 'Maya Safitri', action: 'ASSIGN', description: 'Menugaskan task prioritas URGENT ke Reza Pratama', created_at: '2026-09-12T08:15:00Z' },
      { id: 'act-32', task_id: 'task-3', actor_id: 'user-designer-1', actor_name: 'Reza Pratama', action: 'FILE_UPLOAD', description: 'Mengunggah draft V1', created_at: '2026-09-13T14:00:00Z' },
      { id: 'act-33', task_id: 'task-3', actor_id: 'user-manager', actor_name: 'Maya Safitri', action: 'REVISION_REQUEST', description: 'Meminta revisi putaran #1 (Badge 10.10 & varian TikTok Shop)', created_at: '2026-09-13T16:15:00Z' }
    ],
    dependencies: []
  },

  {
    id: 'task-4',
    task_id: 'CR-2026-00004',
    title: 'Catalog Produk Cetak 16 Halaman Versi Distributor',
    description: 'Katalog cetak spesifikasi produk, harga grosir, dan syarat kemitraan distributor seluruh Indonesia.',
    task_type: 'Catalog Cetak',
    project_id: 'prj-1',
    project_name: 'New Product Launch: Sambal Sambu',
    campaign_id: 'cmp-1',
    campaign_name: 'Teaser & Launching Sambal Sambu',
    department_id: 'dept-1',
    department_name: 'Creative & Graphic Design',
    requester_id: 'user-requester-1',
    requester_name: 'Anita Kusumawardani',
    manager_id: 'user-manager',
    manager_name: 'Maya Safitri',
    current_assignee_id: 'user-designer-2',
    current_assignee_name: 'Sarah Lestari',
    current_assignee_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    original_assignee_id: 'user-designer-2',
    original_assignee_name: 'Sarah Lestari',
    priority: 'NORMAL',
    deadline: '2026-09-18T17:00:00Z',
    estimated_effort: '20 Jam',
    progress_percentage: 90,
    status: 'UNDER_REVIEW',
    is_archived: false,
    created_at: '2026-09-08T10:00:00Z',
    updated_at: '2026-09-13T15:30:00Z',

    brief: {
      id: 'brief-4',
      task_id: 'task-4',
      objective: 'Brosur katalog resmi untuk presentasi ke ritel modern dan distributor daerah',
      target_audience: 'B2B Partner, pemilik toko retail, distributor FMCG',
      keyMessage: 'Peluang Bisnis Menguntungkan Bersama Brand Sambal Terfavorit',
      designDirection: 'Profesional, layout editorial majalah rapi, tata letak tabel tabel harga bersih',
      mandatoryElements: 'Profil Perusahaan, Sertifikasi Pabrik, Daftar Varian, Syarat Minimum Order',
      doList: 'Standar cetak CMYK 300 DPI dengan bleed 3mm',
      dontList: 'Jangan gunakan format RGB atau kompresi low-res',
      reference_links: []
    },

    checklists: [
      { id: 'chk-41', task_id: 'task-4', title: 'Layout Cover Depan & Belakang', completed: true, completed_by: 'user-designer-2', completed_at: '2026-09-10T15:00:00Z', sort_order: 1 },
      { id: 'chk-42', task_id: 'task-4', title: 'Halaman 1-8: Varian & Keunggulan Produk', completed: true, completed_by: 'user-designer-2', completed_at: '2026-09-12T17:00:00Z', sort_order: 2 },
      { id: 'chk-43', task_id: 'task-4', title: 'Halaman 9-16: Tabel Harga & Form Distributor', completed: true, completed_by: 'user-designer-2', completed_at: '2026-09-13T14:00:00Z', sort_order: 3 },
      { id: 'chk-44', task_id: 'task-4', title: 'Pre-flight check CMYK & Bleed', completed: true, completed_by: 'user-designer-2', completed_at: '2026-09-13T15:00:00Z', sort_order: 4 }
    ],

    versions: [
      {
        id: 'ver-41',
        task_id: 'task-4',
        version_number: 'V1',
        uploaded_by: 'user-designer-2',
        uploaded_by_name: 'Sarah Lestari',
        file_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80',
        file_name: 'Katalog_Distributor_Sambu_V1_Preview.pdf',
        file_type: 'application/pdf',
        file_size: 18500000,
        description: 'Complete 16 pages preview PDF for internal editorial review.',
        is_approved: false,
        created_at: '2026-09-13T15:30:00Z'
      }
    ],

    revisions: [],
    handovers: [],
    assignments: [
      {
        id: 'asg-41',
        task_id: 'task-4',
        assigned_to: 'user-designer-2',
        assigned_to_name: 'Sarah Lestari',
        assigned_by: 'user-manager',
        assigned_by_name: 'Maya Safitri',
        reason: 'Keahlian dalam editorial & layout cetak',
        assigned_at: '2026-09-08T10:30:00Z'
      }
    ],
    comments: [
      {
        id: 'com-41',
        task_id: 'task-4',
        user_id: 'user-designer-2',
        user_name: 'Sarah Lestari',
        user_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        comment: 'Bu Maya, seluruh 16 halaman sudah selesai disatukan dan saya submit ke UNDER REVIEW. Mohon dicek nomor kontak sales di halaman 15.',
        mentions: ['maya.manager@creativetaskflow.internal'],
        created_at: '2026-09-13T15:35:00Z'
      }
    ],
    activity_logs: [
      { id: 'act-41', task_id: 'task-4', actor_id: 'user-manager', actor_name: 'Maya Safitri', action: 'ASSIGN', description: 'Menugaskan task ke Sarah Lestari', created_at: '2026-09-08T10:30:00Z' },
      { id: 'act-42', task_id: 'task-4', actor_id: 'user-designer-2', actor_name: 'Sarah Lestari', action: 'FILE_UPLOAD', description: 'Mengunggah V1 preview PDF 16 halaman', created_at: '2026-09-13T15:30:00Z' },
      { id: 'act-43', task_id: 'task-4', actor_id: 'user-designer-2', actor_name: 'Sarah Lestari', action: 'STATUS_CHANGE', description: 'Mengubah status menjadi UNDER_REVIEW', created_at: '2026-09-13T15:32:00Z' }
    ],
    dependencies: []
  },

  {
    id: 'task-5',
    task_id: 'CR-2026-00005',
    title: 'Instagram Carousel 5 Slide: Tips Menyimpan Sambal Botol Agar Tahan 6 Bulan',
    description: 'Edukasi konten organik cara penyimpanan higienis untuk meningkatkan shares dan saves akun IG brand.',
    task_type: 'Social Media Carousel',
    project_id: 'prj-3',
    project_name: 'Always-On Social Media 2026',
    department_id: 'dept-2',
    department_name: 'Content Creation & Video',
    requester_id: 'user-requester-1',
    requester_name: 'Anita Kusumawardani',
    manager_id: 'user-manager',
    manager_name: 'Maya Safitri',
    priority: 'LOW',
    deadline: '2026-09-20T17:00:00Z',
    estimated_effort: '5 Jam',
    progress_percentage: 0,
    status: 'REQUESTED',
    is_archived: false,
    created_at: '2026-09-13T14:00:00Z',
    updated_at: '2026-09-13T14:00:00Z',

    brief: {
      id: 'brief-5',
      task_id: 'task-5',
      objective: 'Edukasi konsumen tentang tips penyimpanan sambal agar tidak cepat basi',
      target_audience: 'Followers aktif akun Instagram brand',
      keyMessage: 'Pakai sendok bersih, tutup rapat, dan simpan di kulkas setelah dibuka!',
      designDirection: 'Infografis modern, ilustrasi ramah, slide 1 clickable hook',
      mandatoryElements: 'Logo di setiap slide, slide 5 penutup dengan CTA "Save for later"',
      doList: 'Teks per slide maksimal 25 kata agar nyaman dibaca cepat',
      dontList: 'Hindari paragraf tebal bertumpuk',
      reference_links: []
    },

    checklists: [
      { id: 'chk-51', task_id: 'task-5', title: 'Slide 1: Hook Headline Pertanyaan', completed: false, sort_order: 1 },
      { id: 'chk-52', task_id: 'task-5', title: 'Slide 2-4: Langkah Praktis Penyimpanan', completed: false, sort_order: 2 },
      { id: 'chk-53', task_id: 'task-5', title: 'Slide 5: Ringkasan & CTA Simpan Post', completed: false, sort_order: 3 }
    ],

    versions: [],
    revisions: [],
    handovers: [],
    assignments: [],
    comments: [],
    activity_logs: [
      { id: 'act-51', task_id: 'task-5', actor_id: 'user-requester-1', actor_name: 'Anita Kusumawardani', action: 'CREATE', description: 'Membuat permintaan task baru CR-2026-00005', created_at: '2026-09-13T14:00:00Z' }
    ],
    dependencies: []
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-1',
    actor_id: 'user-requester-1',
    actor_name: 'Anita Kusumawardani',
    action: 'CREATE',
    entity_type: 'TASK',
    entity_id: 'CR-2026-00001',
    before_value: null,
    after_value: { title: 'Poster Promo Sambal Sambu Pedas Nampol', priority: 'HIGH', deadline: '2026-09-15' },
    created_at: '2026-09-10T09:00:00Z'
  },
  {
    id: 'aud-2',
    actor_id: 'user-manager',
    actor_name: 'Maya Safitri',
    action: 'ASSIGN',
    entity_type: 'TASK',
    entity_id: 'CR-2026-00001',
    before_value: { assignee_id: null },
    after_value: { assignee_id: 'user-designer-1', assignee_name: 'Reza Pratama' },
    created_at: '2026-09-10T09:15:00Z'
  },
  {
    id: 'aud-3',
    actor_id: 'user-designer-1',
    actor_name: 'Reza Pratama',
    action: 'FILE_UPLOAD',
    entity_type: 'VERSION',
    entity_id: 'CR-2026-00001-V1',
    before_value: null,
    after_value: { version: 'V1', file_name: 'CR-00001_SambalSambu_Poster_V1.jpg', size: 4520000 },
    created_at: '2026-09-11T14:30:00Z'
  },
  {
    id: 'aud-4',
    actor_id: 'user-manager',
    actor_name: 'Maya Safitri',
    action: 'REVISION_REQUEST',
    entity_type: 'REVISION',
    entity_id: 'CR-2026-00001-REV-1',
    before_value: { status: 'UNDER_REVIEW' },
    after_value: { status: 'REVISION_REQUIRED', feedback_items: 3 },
    created_at: '2026-09-12T10:30:00Z'
  },
  {
    id: 'aud-5',
    actor_id: 'user-manager',
    actor_name: 'Maya Safitri',
    action: 'HANDOVER',
    entity_type: 'TASK_HANDOVER',
    entity_id: 'CR-2026-00001',
    before_value: { current_assignee: 'Reza Pratama' },
    after_value: { current_assignee: 'Sarah Lestari', reason: 'Reza dialihkan ke campaign Flash Sale 10.10', current_version: 'V2' },
    created_at: '2026-09-12T13:30:00Z'
  },
  {
    id: 'aud-6',
    actor_id: 'user-designer-2',
    actor_name: 'Sarah Lestari',
    action: 'FILE_UPLOAD',
    entity_type: 'VERSION',
    entity_id: 'CR-2026-00001-V4',
    before_value: { current_version: 'V3' },
    after_value: { version: 'V4 (FINAL)', file_name: 'CR-00001_SambalSambu_Poster_FINAL.jpg' },
    created_at: '2026-09-13T14:45:00Z'
  },
  {
    id: 'aud-7',
    actor_id: 'user-manager',
    actor_name: 'Maya Safitri',
    action: 'APPROVAL',
    entity_type: 'APPROVAL',
    entity_id: 'CR-2026-00001',
    before_value: { status: 'UNDER_REVIEW' },
    after_value: { status: 'APPROVED', approved_version: 'V4 (FINAL)', approved_by: 'Maya Safitri' },
    created_at: '2026-09-13T15:45:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    recipient_id: 'user-designer-1',
    type: 'TASK_ASSIGNED',
    title: 'Tugas Baru Diberikan',
    message: 'Anda ditugaskan pada task CR-2026-00003: Banner Marketplace 10.10 Flash Sale (Prioritas URGENT)',
    entity_id: 'task-3',
    is_read: false,
    created_at: '2026-09-12T08:15:00Z'
  },
  {
    id: 'notif-2',
    recipient_id: 'user-designer-1',
    type: 'REVISION_REQUESTED',
    title: 'Permintaan Revisi Baru #1',
    message: 'Maya Safitri meminta revisi pada task CR-2026-00003: Perbaiki warna kuning badge 10.10',
    entity_id: 'task-3',
    is_read: false,
    created_at: '2026-09-13T16:15:00Z'
  },
  {
    id: 'notif-3',
    recipient_id: 'user-designer-2',
    type: 'HANDOVER_RECEIVED',
    title: 'Pekerjaan Dialihkan (Handover)',
    message: 'Pekerjaan CR-2026-00001 dipindahkan dari Reza Pratama kepada Anda. Cek catatan handover.',
    entity_id: 'task-1',
    is_read: true,
    created_at: '2026-09-12T13:30:00Z'
  },
  {
    id: 'notif-4',
    recipient_id: 'user-manager',
    type: 'TASK_SUBMITTED',
    title: 'Submission Masuk: Menunggu Review',
    message: 'Sarah Lestari telah menyelesaikan V1 Katalog Distributor (CR-2026-00004) dan menunggu review.',
    entity_id: 'task-4',
    is_read: false,
    created_at: '2026-09-13T15:32:00Z'
  },
  {
    id: 'notif-5',
    recipient_id: 'user-content-1',
    type: 'DEADLINE_APPROACHING',
    title: 'Deadline Mendekat (H-1)',
    message: 'Task CR-2026-00002 (Reels BTS Masak) memiliki deadline besok 14 September 17:00 WIB.',
    entity_id: 'task-2',
    is_read: false,
    created_at: '2026-09-13T09:00:00Z'
  }
];
