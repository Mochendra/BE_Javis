// import mysql from 'mysql2/promise';
// import dotenv from 'dotenv';
// dotenv.config();

// const pool = mysql.createPool({
//   host: process.env.DB_HOST || 'localhost',
//   port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'auth_system',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// export default pool;


import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql'
  }
);

export default sequelize;
