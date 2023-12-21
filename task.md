## Tugas

1. Buat table members dan casdi appointments (DONE)
2. Buat CRUD untuk members di BE for now we only need in BE
   Requirement kode anggota:
   - Kode berawalan dengan N untuk NonASD (DONE)
   - Kode berawalan dengan A untuk ASD (DONE)
3. Buat CRUD untuk casdi appointments (DONE)
   Requirement untuk Create:

   - Satu anggota hanya bisa satu appointment. (DONE)
   - tanggal dan jam yang sudah digunakan tidak boleh dipakai lagi. (DONE)
   - tanggal tidak boleh masa lalu. (DONE)
   - (Tanya) tanggal appointment itu bisa H+ berapa dari hari ini ? (DONE)

4. Buat tampilan untuk casdi appointments (DONE)

5. Buat Artikel untuk casdi

   - Tabel
   - CRUD
   - FE (Tampilan depan)/ buat dashboard sendiri buat casdi aja

6. Buat forum tanya jawab untuk casdi
   a. Tabel questions - question - created_at - updated_at 
   b. Table answers (access by admin) - question_id - answer - created_at - updated_at
   c. Question
      - Create (Non Role)
      - Get All left Join with Question (Non Role)
      - Delete (Admin)
   d. Answer
      - Create (Admin)
      - Edit (Admin)
      - Delete (Admin)
   d. FE tampilan 
      - Buat Page Tampilkan Pertanyaan
        + Kolom Pertanyaan diatas sendiri
        + Show Card Pertanyaan yang ada paginationnya
        + Dibawah Show Card Pertanyaan ada Kolom menjawab untuk admin
        + Kalau belum ada jawaban  hanya ada tombol buat
        + Kalau sudah ada jawaban  ada tombol edit,dan delete
