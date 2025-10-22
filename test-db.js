import pool from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    console.log('Koneksi ke database berhasil', rows);
    process.exit(0);
  } catch (err) {
    console.error('Koneksi ke database gagal', err);
    process.exit(1);
  }
})();
