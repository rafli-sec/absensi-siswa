# Dynamic Absensi Matrix Columns

**Status**: ⏳ In Progress

## Steps:
- [ ] **Step 1**: Backend - Add `tanggalPertemuan` to rekapAbsensi data in `index()` type='kelas', sanitize year from bulan filter
- [ ] **Step 2**: Frontend - Update `showDetail()` to use dynamic `detailSession.tanggalPertemuan.map()`, fix status lookup
- [ ] **Step 3**: PDF - `@foreach($tanggalPertemuan as $tgl)` replace hardcoded loops
- [ ] **Step 4**: Test modal/PDF with real data

**Current Step**: Step 1

