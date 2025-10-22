import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'ubah_rahasia_jwt_yg_panjang';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

const cookieOptions = {
  httpOnly: true,
  secure: false, // localhost pakai false
  sameSite: 'lax',
  maxAge: 1000 * 60 * 60
};

// export async function register(req, res) {
//   const { name, email, password } = req.body;
//   if (!name || !email || !password) return res.status(400).json({ error: 'Semua field wajib diisi' });

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(email)) return res.status(400).json({ error: 'Format email tidak valid' });

//   try {
//     const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
//     if (rows.length > 0) return res.status(409).json({ error: 'Email sudah terdaftar' });

//     const hash = await bcrypt.hash(password, 10);

//     const [result] = await pool.query(
//       'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
//       [name, email, hash]
//     );
//     return res.status(201).json({ message: 'Registrasi berhasil', userId: result.insertId });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Terjadi kesalahan server' });
//   }
// }

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email dan password wajib diisi' });

  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, password_hash, role FROM users WHERE email = ?',
      [email]
    );
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Email atau password salah' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Email atau password salah' });

    const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.cookie('token', token, cookieOptions);
    return res.json({ message: 'Login berhasil' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}

export async function logout(req, res) {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  return res.json({ message: 'Logout berhasil' });
}

export async function me(req, res) {
  if (!req.user) return res.status(401).json({ error: 'Tidak terautentikasi' });

  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'User tidak ditemukan' });
    return res.json({ user: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
}
