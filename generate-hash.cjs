const bcrypt = require('bcrypt');

(async () => {
  const password = 'admin123'; // password baru
  const hash = await bcrypt.hash(password, 10);
  console.log('Hash bcrypt baru:', hash);
})();
