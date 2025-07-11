# 🔍 Pencocokan Otomatis Barang Hilang - Next.js + Hugging Face

Aplikasi pencocokan otomatis antara laporan **barang hilang** dan **barang temuan** menggunakan model **text similarity** dari Hugging Face. Dibangun dengan **Next.js** (App Router & Client Components), aplikasi ini mencocokkan data berdasarkan kemiripan teks (deskripsi, nama barang, dan lokasi kejadian).

## 🚀 Fitur

- Fetch data laporan dari API eksternal.
- Pemisahan laporan `hilang` dan `temuan`.
- Proses pencocokan paralel menggunakan `Promise.all`.
- Pencocokan dilakukan menggunakan model `sentence-transformers/all-MiniLM-L6-v2`.
- Threshold kemiripan dapat diatur (default 0.75).
- Menampilkan hasil pasangan laporan dengan similarity tertinggi.

## 🧠 Teknologi

- **Next.js (App Router)**
- **Hugging Face Inference API** (model: `all-MiniLM-L6-v2`)
- **Tailwind CSS** (UI)
- **Fetch API** untuk komunikasi data
- **Dotenv** untuk token Hugging Face

## 🔐 Konfigurasi `.env.local`

Buat file `.env.local` dan masukkan token Hugging Face Anda:
NEXT_PUBLIC_API_URL=api_to_fetch_laporan
HF_TOKEN=hf_your_access_token_here

> Dapatkan token dari: https://huggingface.co/settings/tokens

## 📦 Instalasi

```bash
# 1. Clone repo ini
git clone https://github.com/your-username/nama-repo.git
cd nama-repo

# 2. Install dependensi
npm install

# 3. Jalankan server
npm run dev
```

## 📊 Output

Contoh Output:
Skor Similarity: 86.52%
🧾 Laporan Hilang: Dompet Kulit Hitam - Terminal Umbulharjo
🧾 Laporan Temuan: Dompet warna hitam - Area parkir terminal
