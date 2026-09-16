import React, { useState, useRef } from 'react';
import {
  FileText,
  Printer,
  Download,
  X,
  CheckCircle2,
  ShieldCheck,
  Layers,
  Sparkles,
  Users,
  Calendar,
  Eye,
  ArrowRight,
  BookOpen,
  Info,
  Check,
  Zap,
  HelpCircle,
  FileCheck,
  Search
} from 'lucide-react';

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserManualModal: React.FC<UserManualModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'all' | 'admin' | 'user' | 'pipeline' | 'faq'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 md:p-6 overflow-y-auto animate-page-enter">
      <div className="modal-3d bg-white dark:bg-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar (Screen Only) */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-white/10 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white font-display">
                  Panduan Penggunaan Aplikasi (Buku Manual)
                </h3>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  Format Siap PDF
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Pedoman operasional lengkap untuk Administrator dan Pengguna (Desainer, Kreator, Klien)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
              title="Cetak atau Simpan sebagai PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Cetak / Unduh PDF</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Tutup Panduan"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter & Navigation Bar (Screen Only) */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveSection('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeSection === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Semua Bagian (Lengkap)
            </button>
            <button
              onClick={() => setActiveSection('admin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeSection === 'admin'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Bagian Admin & Manajer
            </button>
            <button
              onClick={() => setActiveSection('user')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeSection === 'user'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              Bagian Desainer & Kreator
            </button>
            <button
              onClick={() => setActiveSection('pipeline')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeSection === 'pipeline'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              5 Tahapan Alur Desain
            </button>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-500" />
            <span>Klik <strong>"Cetak / Unduh PDF"</strong> lalu pilih <em>Save as PDF</em> di browser Anda.</span>
          </div>
        </div>

        {/* Printable & Scrollable Content Area */}
        <div
          ref={printAreaRef}
          className="flex-1 overflow-y-auto p-5 sm:p-8 md:p-10 space-y-10 text-slate-800 dark:text-slate-200 print:p-0 print:overflow-visible print:text-black print:dark:text-black bg-white dark:bg-slate-900 print:bg-white"
          id="printable-manual"
        >
          {/* Cover / Header Document */}
          <div className="border-b-2 border-indigo-600 pb-6 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-[11px] font-black tracking-widest uppercase px-3 py-1 rounded-md bg-indigo-100 text-indigo-900 border border-indigo-300 font-mono">
                  SOP & USER MANUAL RESMI • CREATIVE FLOW STUDIO
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 dark:text-white print:text-black mt-2 font-display">
                  Panduan Penggunaan Aplikasi & Tata Cara Operasional
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 print:text-slate-700 mt-1 max-w-3xl">
                  Buku manual terpadu alur kerja monitoring desain grafis, manajemen penugasan, quality control (QC), penomoran versi file, serah terima, hingga konfigurasi hak akses pengguna (RBAC).
                </p>
              </div>

              <div className="text-right text-xs text-slate-500 font-mono">
                <div>Versi Dokumen: <strong>v2.4.0 (2026)</strong></div>
                <div>Status: <strong>Aktif / Berlaku</strong></div>
                <div>Klasifikasi: <strong>Internal Studio & Klien</strong></div>
              </div>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 print:bg-slate-100 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Peran (Role)</span>
                <span className="text-lg font-black text-indigo-600">5 Peran Pengguna</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 print:bg-slate-100 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Alur Desain (Pipeline)</span>
                <span className="text-lg font-black text-purple-600">5 Tahap Produksi</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 print:bg-slate-100 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Kontrol Kualitas (QC)</span>
                <span className="text-lg font-black text-teal-600">Terverifikasi Ketat</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 print:bg-slate-100 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Sistem Audit Log</span>
                <span className="text-lg font-black text-emerald-600">Terekam Otomatis</span>
              </div>
            </div>
          </div>

          {/* DAFTAR ISI */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850/70 print:bg-slate-50 border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white print:text-black mb-3 font-display">
              Daftar Isi Panduan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <a href="#bab1" className="text-indigo-600 hover:underline flex items-center gap-1.5 font-medium">
                <span className="font-bold">BAB 1.</span> Pengenalan & Arsitektur Peran (Role & Akses)
              </a>
              <a href="#bab2" className="text-indigo-600 hover:underline flex items-center gap-1.5 font-medium">
                <span className="font-bold">BAB 2.</span> Panduan Khusus Administrator & Manager
              </a>
              <a href="#bab3" className="text-indigo-600 hover:underline flex items-center gap-1.5 font-medium">
                <span className="font-bold">BAB 3.</span> Panduan Desainer Grafis & Eksekusi Karya
              </a>
              <a href="#bab4" className="text-indigo-600 hover:underline flex items-center gap-1.5 font-medium">
                <span className="font-bold">BAB 4.</span> Panduan Content Creator & Klien (Order & Feedback)
              </a>
              <a href="#bab5" className="text-indigo-600 hover:underline flex items-center gap-1.5 font-medium">
                <span className="font-bold">BAB 5.</span> Detail 5 Tahapan Alur Kerja Produksi Desain
              </a>
              <a href="#bab6" className="text-indigo-600 hover:underline flex items-center gap-1.5 font-medium">
                <span className="font-bold">BAB 6.</span> Fitur Khusus: Handover, AI Studio, & Kalender
              </a>
            </div>
          </div>

          {/* BAB 1: PENGENALAN & PERAN HAK AKSES */}
          {(activeSection === 'all' || activeSection === 'admin') && (
            <section id="bab1" className="space-y-4 pt-2">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-sm">
                  01
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white print:text-black font-display">
                  BAB 1. Struktur Peran & Hak Akses Pengguna (RBAC)
                </h2>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 print:text-slate-800">
                Aplikasi ini mengadopsi <strong>Role-Based Access Control (RBAC)</strong> yang ketat untuk menjaga keamanan aset kreatif dan integritas alur kerja. Terdapat 5 tingkatan peran:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse border border-slate-200 dark:border-slate-700">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-2.5 border border-slate-200 dark:border-slate-700">Peran (Role)</th>
                      <th className="p-2.5 border border-slate-200 dark:border-slate-700">Target Pengguna</th>
                      <th className="p-2.5 border border-slate-200 dark:border-slate-700">Wewenang Utama</th>
                      <th className="p-2.5 border border-slate-200 dark:border-slate-700">Batasan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700 font-medium">
                    <tr>
                      <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-bold text-purple-600">
                        SUPER ADMIN
                      </td>
                      <td className="p-2.5 border border-slate-200 dark:border-slate-700">Pemilik Studio / IT Head</td>
                      <td className="p-2.5 border border-slate-200 dark:border-slate-700">
                        Mengubah nama & peran personil, menghapus data tugas, mereset password, mengunduh backup SQL, bypass seluruh validasi SOP.
                      </td>
                      <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-emerald-600 font-semibold">
                        Tidak ada batasan
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-bold text-amber-600">
                        MANAGER / ART DIR
                      </td>
                      <td className="p-2.5 border border-slate-200 dark:border-slate-700">Art Director / Project Lead</td>
                      <td className="p-2.5 border border-slate-200 dark:border-slate-700">
                        Validasi brief order baru, delegasi/assign tugas ke desainer, review kualitas (QC), menyetujui approval final.
                      </td>
                      <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-slate-500">
                        Tidak bisa menghapus user Super Admin
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-bold text-indigo-600">
                        DESIGNER
                      </td>
                      <td className="p-2.5 border border-slate-200 dark:border-slate-700">Graphic / Motion Designer</td>
                      <td className="p-2.5 border border-slate-200 dark:border-slate-700">
                        Mengubah status pekerjaan berjalan, mengunggah draf visual (v1.0, v1.1), mencentang checklist perbaikan revisi, serah terima file final.
                      </td>
                      <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-slate-500">
                        Hanya fokus pada tugas yang ditugaskan kepadanya
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-bold text-teal-600">
                        CONTENT CREATOR
                      </td>
                      <td className="p-2.5 border border-slate-200 dark:border-slate-700">Copywriter / Social Media Lead</td>
                      <td className="p-2.5 border border-slate-200 dark:border-slate-700">
                        Membuat request order desain baru beserta copy teks & panduan visual, merequest revisi jika belum sesuai pesan kampanye.
                      </td>
                      <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-slate-500">
                        Tidak bisa mengubah status teknis produksi
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-bold text-slate-600">
                        REQUESTER / CLIENT
                      </td>
                      <td className="p-2.5 border border-slate-200 dark:border-slate-700">Klien Eksternal / Stakeholder</td>
                      <td className="p-2.5 border border-slate-200 dark:border-slate-700">
                        Melihat perkembangan status secara transparan, pratinjau draf mockup, memberikan tanggapan, dan mengunduh paket file final.
                      </td>
                      <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-slate-500">
                        Akses read-only ke manajemen tim & menu setting
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* BAB 2: PANDUAN ADMINISTRATOR & MANAGER */}
          {(activeSection === 'all' || activeSection === 'admin') && (
            <section id="bab2" className="space-y-4 pt-2">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
                  02
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white print:text-black font-display">
                  BAB 2. Panduan Khusus Administrator & Manager
                </h2>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 print:text-slate-800">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 print:bg-slate-100 border border-slate-200 dark:border-slate-700 space-y-2">
                  <h4 className="font-extrabold text-slate-900 dark:text-white print:text-black flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    2.1 Cara Merubah Nama Personil & Hak Akses (RBAC)
                  </h4>
                  <ol className="list-decimal pl-5 space-y-1.5 leading-relaxed">
                    <li>Klik menu <strong>"Tim & Hak Akses"</strong> pada bilah navigasi sebelah kiri.</li>
                    <li>Cari personil yang ingin diubah melalui bilah pencarian atau filter peran.</li>
                    <li>Klik tombol <strong>"Edit"</strong> (ikon pensil) pada kartu personil terkait.</li>
                    <li>Ubah <em>Nama Lengkap</em>, <em>Jabatan/Posisi</em>, <em>Email</em>, atau <em>Peran (Role)</em> yang diinginkan.</li>
                    <li>Klik <strong>"Simpan Perubahan"</strong>. Perubahan hak akses akan langsung aktif seketika.</li>
                  </ol>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 print:bg-slate-100 border border-slate-200 dark:border-slate-700 space-y-2">
                  <h4 className="font-extrabold text-slate-900 dark:text-white print:text-black flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    2.2 Menambah Personil Baru atau Menghapus Akun
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
                    <li>Untuk menambah anggota baru, klik tombol <strong>"+ Tambah Anggota Baru"</strong> di sudut kanan atas halaman Tim.</li>
                    <li>Pilih preset avatar desainer, isi data lengkap, dan tentukan peran awal.</li>
                    <li>Jika personil dinonaktifkan sementara, ubah status menjadi <em>Nonaktif</em> agar tidak dapat ditugaskan tugas baru namun riwayat pekerjaan lampaunya tetap tersimpan aman.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 print:bg-slate-100 border border-slate-200 dark:border-slate-700 space-y-2">
                  <h4 className="font-extrabold text-slate-900 dark:text-white print:text-black flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-teal-600" />
                    2.3 Melakukan Quality Review (QC) & Approval Final
                  </h4>
                  <ol className="list-decimal pl-5 space-y-1.5 leading-relaxed">
                    <li>Pantau indikator <strong>"Menunggu Review"</strong> pada header pipeline.</li>
                    <li>Buka kartu tugas dan teliti tab <em>Versi Desain</em> untuk memeriksa file gambar resolusi penuh.</li>
                    <li>Ceklist kepatuhan SOP (Format ukuran, bleed margin, kesesuaian palet warna HEX, dan kejelasan tipografi).</li>
                    <li>Jika sudah sempurna, klik tombol hijau <strong>"Setujui Desain (Approve)"</strong> untuk mengunci versi tersebut ke status final.</li>
                    <li>Jika ada kekurangan, klik <strong>"Minta Revisi"</strong> dan berikan catatan poin-poin yang wajib diperbaiki desainer.</li>
                  </ol>
                </div>
              </div>
            </section>
          )}

          {/* BAB 3: PANDUAN DESAINER GRAFIS */}
          {(activeSection === 'all' || activeSection === 'user') && (
            <section id="bab3" className="space-y-4 pt-2">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
                  03
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white print:text-black font-display">
                  BAB 3. Panduan Operasional Desainer Grafis
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white print:text-black flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                    Cek Menu "Pekerjaan Saya"
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
                    Setiap hari kerja, klik tab <strong>"Pekerjaan Saya"</strong> untuk melihat daftar tugas yang menjadi tanggung jawab Anda beserta indikator tenggat waktu (deadline).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white print:text-black flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                    Mulai Pengerjaan (Start Work)
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
                    Klik tugas terkait lalu ubah status dari <em>Ditugaskan</em> menjadi <strong>"Sedang Dikerjakan (In Progress)"</strong> agar Art Director mengetahui tugas sedang dieksekusi.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white print:text-black flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">3</span>
                    Unggah Draf & Penomoran Versi
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
                    Unggah file pratinjau melalui tab <em>Versi File</em>. Sistem secara otomatis menerapkan aturan penamaan versi (misal: <strong>v1.0</strong> untuk draf perdana, <strong>v1.1</strong> setelah perbaikan revisi).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white print:text-black flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">4</span>
                    Kirim untuk Review (Submit QC)
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
                    Setelah draf diunggah, klik <strong>"Kirim untuk Review"</strong>. Tugas akan berpindah ke Tahap 03 dan notifikasi review otomatis terkirim ke Art Director / Manager.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* BAB 4: PANDUAN CONTENT CREATOR & KLIEN */}
          {(activeSection === 'all' || activeSection === 'user') && (
            <section id="bab4" className="space-y-4 pt-2">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-sm">
                  04
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white print:text-black font-display">
                  BAB 4. Panduan Content Creator & Klien
                </h2>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 print:text-slate-800">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 print:bg-slate-100 border border-slate-200 dark:border-slate-700 space-y-2">
                  <h4 className="font-extrabold text-slate-900 dark:text-white print:text-black">
                    4.1 Cara Membuat Order Brief Desain Baru
                  </h4>
                  <ol className="list-decimal pl-5 space-y-1 leading-relaxed">
                    <li>Klik tombol <strong>"+ Buat Pekerjaan Desain"</strong> pada navigasi atau header alur.</li>
                    <li>Isi <em>Judul Desain</em> yang jelas (misal: "Feed Instagram Promo Gajian Akhir Bulan").</li>
                    <li>Pilih <em>Format Desain</em>: Instagram Feed (1:1 / 4:5), IG Story (9:16), Banner Web, Cetak/Brosur, atau Desain Kemasan.</li>
                    <li>Tentukan <em>Prioritas</em> (Normal, High, Urgent) dan <em>Tenggat Waktu (Deadline)</em>.</li>
                    <li>Lampirkan teks narasi (copywriting), headline promo, serta link folder referensi aset.</li>
                    <li>Klik <strong>"Kirim Brief Desain"</strong>.</li>
                  </ol>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 print:bg-slate-100 border border-slate-200 dark:border-slate-700 space-y-2">
                  <h4 className="font-extrabold text-slate-900 dark:text-white print:text-black">
                    4.2 Memberikan Catatan Revisi yang Konstruktif
                  </h4>
                  <p className="leading-relaxed">
                    Jika hasil visual draf belum selaras dengan ekspektasi, gunakan fitur <strong>"Minta Revisi"</strong>. Tuliskan poin-poin yang spesifik, misal: <em>"1. Ganti warna teks tombol menjadi oranye HEX #F97316; 2. Perbesar logo sponsor 15% di pojok kanan bawah."</em> Hindari instruksi ambigu seperti <em>"tolong dibikin lebih menarik"</em> agar pengerjaan revisi cepat selesai.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* BAB 5: DETAIL 5 TAHAPAN ALUR PIPELINE */}
          {(activeSection === 'all' || activeSection === 'pipeline') && (
            <section id="bab5" className="space-y-4 pt-2">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-sm">
                  05
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white print:text-black font-display">
                  BAB 5. Penjelasan Detail 5 Tahapan Alur Kerja Produksi
                </h2>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/20">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-purple-700 dark:text-purple-300">
                      TAHAP 01: Validasi Brief & Konsep Awal
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-200 text-purple-900">
                      Status: REQUESTED, ASSIGNED
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-1 text-xs leading-relaxed">
                    Penerimaan materi teks, brief, resolusi target, dan penentuan desainer pelaksana oleh Art Director.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-indigo-700 dark:text-indigo-300">
                      TAHAP 02: Desain Visual & Unggah Draf
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-200 text-indigo-900">
                      Status: IN_PROGRESS
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-1 text-xs leading-relaxed">
                    Proses eksekusi software kreatif (Photoshop, Illustrator, Figma). Desainer mengunggah file draf mockup v1.0.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/50 dark:bg-teal-950/20">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-teal-700 dark:text-teal-300">
                      TAHAP 03: Quality Review (QC) & Uji Standar
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-200 text-teal-900">
                      Status: SUBMITTED, UNDER_REVIEW, RESUBMITTED
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-1 text-xs leading-relaxed">
                    Pemeriksaan mutu oleh Art Director. Checklist kesesuaian brand guideline, ejaan teks, kontras, dan resolusi cetak/layar.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-rose-700 dark:text-rose-300">
                      TAHAP 04: Revisi & Penyempurnaan Visual
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-200 text-rose-900">
                      Status: REVISION_REQUIRED
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-1 text-xs leading-relaxed">
                    Tahap perbaikan jika draf belum lolos QC atau ada feedback dari klien. Versi dinaikkan menjadi v1.1, v1.2, dst.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-emerald-700 dark:text-emerald-300">
                      TAHAP 05: Persetujuan (Approved) & Serah Terima File
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                      Status: APPROVED, COMPLETED
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-1 text-xs leading-relaxed">
                    Karya telah disetujui 100%. Penyerahan paket master file (AI/PSD/PDF siap cetak & PNG transparan) ke klien atau tim sosial media.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* BAB 6: FITUR SPESIAL & DUKUNGAN */}
          {activeSection === 'all' && (
            <section id="bab6" className="space-y-4 pt-2">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                  06
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white print:text-black font-display">
                  BAB 6. Fitur Pendukung & Tips Produktivitas
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <h5 className="font-extrabold text-slate-900 dark:text-white print:text-black flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" />
                    AI Studio Assistant
                  </h5>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Gunakan tombol <strong>AI Studio</strong> di navbar atas untuk generate copywriting otomatis, rangkuman status proyek, dan checklist teknis desain.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <h5 className="font-extrabold text-slate-900 dark:text-white print:text-black flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    Kalender & Deadline
                  </h5>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Pantau tenggat waktu posting kampanye melalui tampilan kalender interaktif untuk mencegah keterlambatan jadwal promosi.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <h5 className="font-extrabold text-slate-900 dark:text-white print:text-black flex items-center gap-1.5">
                    <ArrowRight className="w-4 h-4 text-emerald-500" />
                    Handover Pekerjaan
                  </h5>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Jika ada desainer yang cuti atau berhalangan, gunakan tombol <strong>"Handover"</strong> untuk mengalihkan tanggung jawab pekerjaan lengkap dengan catatan ringkasan.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Footer Dokumen Cetak */}
          <div className="pt-8 border-t border-slate-300 dark:border-slate-700 text-center text-[11px] text-slate-500 space-y-1 font-mono">
            <p>© 2026 Creative Flow Studio Management Platform. Hak Cipta Dilindungi Undang-Undang.</p>
            <p>Dokumen ini disusun sebagai Standar Operasional Prosedur (SOP) Digital Resmi.</p>
          </div>
        </div>

        {/* Modal Bottom Actions (Screen Only) */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <FileText className="w-4 h-4 text-indigo-500" />
            <span>Format PDF otomatis diatur tanpa margin potong untuk print A4 / Letter.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
