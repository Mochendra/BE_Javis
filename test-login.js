import bcrypt from 'bcrypt';
import poolModule from './config/db.js';

const pool = poolModule;

(async () => {
  const email = 'admin@example.com';
  const password = 'admin123';

  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  const user = rows[0];

  if (!user) {
    console.log('User tidak ditemukan');
    return;
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (match) console.log('Password cocok');
  else console.log('Password salah');
})();
