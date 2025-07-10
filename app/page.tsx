'use client';

import { useState } from 'react';

export default function Home() {
  const [hasil, setHasil] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pasangan, setPasangan] = useState<any[]>([]);

  const handlePencocokan = async () => {
    setLoading(true);

    try {
      const laporanRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/laporan`);
      const semuaLaporan = await laporanRes.json();

      const laporanProses = semuaLaporan.filter((lap: any) => lap.status === 'proses');
      const hilang = laporanProses.filter((lap: any) => lap.jenis_laporan === 'hilang');
      const temuan = laporanProses.filter((lap: any) => lap.jenis_laporan === 'temuan');

      // Jalankan proses pencocokan paralel
      const pasanganLaporan = await Promise.all(
        hilang.map(async (h: any, i: number) => {
          const source = `${h.nama_barang} ${h.deskripsi} ${h.lokasi_kejadian}`;
          const candidates = temuan.map((t: any) => `${t.nama_barang} ${t.deskripsi} ${t.lokasi_kejadian}`);

          try {
            const res = await fetch('/api/cocokkan', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ source_sentence: source, sentences: candidates }),
            });

            if (!res.ok) {
              console.error(`Gagal membandingkan laporan ${i}:`, await res.text());
              return null;
            }

            const scores = await res.json();
            const maxScore = Math.max(...scores);
            const bestIdx = scores.findIndex((s: number) => s === maxScore);

            if (maxScore >= 0.75) {
              return {
                hilang: h,
                temuan: temuan[bestIdx],
                similarity: maxScore,
              };
            }
          } catch (err) {
            console.error(`Error laporan ${i}:`, err);
          }

          return null;
        })
      );

      // Hapus pasangan null
      const filtered = pasanganLaporan.filter((p) => p !== null);
      setHasil(filtered);
      setPasangan(filtered);
    } catch (err) {
      console.error('Gagal fetch atau proses:', err);
    }

    setLoading(false);
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pencocokan Barang Hilang</h1>

      <button onClick={handlePencocokan} className="bg-blue-600 text-white px-4 py-2 rounded">
        Proses Pencocokan
      </button>

      {loading && <p className="mt-4">Memproses...</p>}

      {hasil.length > 0 && (
        <div className="mt-4">
          <h2 className="font-bold mb-2">Hasil:</h2>
          {pasangan.length > 0 ? (
            <div className="mt-6 space-y-6">
              <h2 className="font-bold text-lg">Pasangan Laporan dengan Similarity Tinggi</h2>
              {pasangan.map((p, i) => (
                <div key={i} className="border rounded-lg p-4 shadow">
                  <p className="font-semibold">Skor Similarity: {(p.similarity * 100).toFixed(2)}%</p>

                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <h3 className="text-blue-600 font-bold">Laporan Hilang</h3>
                      <p>
                        <strong>Nama Barang:</strong> {p.hilang.nama_barang}
                      </p>
                      <p>
                        <strong>Deskripsi:</strong> {p.hilang.deskripsi}
                      </p>
                      <p>
                        <strong>Lokasi:</strong> {p.hilang.lokasi_kejadian}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-green-600 font-bold">Laporan Temuan</h3>
                      <p>
                        <strong>Nama Barang:</strong> {p.temuan.nama_barang}
                      </p>
                      <p>
                        <strong>Deskripsi:</strong> {p.temuan.deskripsi}
                      </p>
                      <p>
                        <strong>Lokasi:</strong> {p.temuan.lokasi_kejadian}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Tidak ditemukan pasangan dengan similarity &gt; 75%</p>
          )}
        </div>
      )}
    </main>
  );
}
